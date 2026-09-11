import { EventBusModule } from '@api/core/event-bus';
import { Neo4jModule } from '@api/core/neo4j';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SendNotificationCommand } from '../../commands/send-notification.command';
import { CommunicationModule } from '../../communication.module';
import { NotificationChannel, RecipientType } from '../../dto/notification.enums';
import { PreferenceService } from '../../services/preference.service';

const shouldRunIntegration = process.env.RUN_INTEGRATION_TESTS === 'true';

(shouldRunIntegration ? describe : describe.skip)('Preference Integration Tests', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let preferenceService: PreferenceService;
  let dataSource: DataSource;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'zanafleet_test',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([]),
        EventBusModule.forRoot({ isGlobal: true }),
        Neo4jModule.forRoot({ isGlobal: true }),
        CommunicationModule,
      ],
    }).compile();

    await module.init();
    commandBus = module.get<CommandBus>(CommandBus);
    preferenceService = module.get<PreferenceService>(PreferenceService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  afterEach(async () => {
    if (dataSource && dataSource.isInitialized) {
      const entityManager = dataSource.manager;
      await entityManager.query('DELETE FROM notifications WHERE "workspaceId" IS NOT NULL');
      await entityManager.query(
        'DELETE FROM notification_preferences WHERE "recipientId" LIKE $1',
        ['test-%']
      );
    }
  });

  describe('Opt-out Preference Handling', () => {
    it('should skip notification when recipient has opted out', async () => {
      const workspaceId = uuidv4();
      const recipientId = uuidv4();

      // Set opt-out preference
      await preferenceService.setPreference(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        false, // disabled
        { workspaceId }
      );

      const command = new SendNotificationCommand(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        'welcome',
        { username: 'TestUser', email: 'test@example.com' },
        workspaceId
      );

      const result = await commandBus.execute(command);

      expect(result.notificationId).toBeDefined();

      // Verify no notification was actually sent (should be skipped)
      const notifications =
        dataSource && dataSource.isInitialized
          ? await dataSource.manager.query('SELECT * FROM notifications WHERE "recipientId" = $1', [
              recipientId,
            ])
          : [];

      // Notification should either not exist or have SKIPPED status
      expect(notifications.length === 0 || notifications[0].status === 'skipped').toBe(true);
    });

    it('should send notification when preference is enabled', async () => {
      const workspaceId = uuidv4();
      const recipientId = uuidv4();

      // Set opt-in preference explicitly
      await preferenceService.setPreference(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        true, // enabled
        { workspaceId }
      );

      const command = new SendNotificationCommand(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        'welcome',
        { username: 'TestUser', email: 'test@example.com' },
        workspaceId
      );

      const result = await commandBus.execute(command);

      expect(result.notificationId).toBeDefined();
    });

    it('should use default enabled when no preference exists', async () => {
      const workspaceId = uuidv4();
      const recipientId = uuidv4(); // No preference set

      const isEnabled = await preferenceService.isEnabled(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        workspaceId
      );

      expect(isEnabled).toBe(true); // Default is enabled (opt-out model)
    });
  });

  describe('Workspace vs Global Preference Precedence', () => {
    it('should use workspace-specific preference over global', async () => {
      const workspaceId = uuidv4();
      const recipientId = uuidv4();

      // Set global preference to enabled
      await preferenceService.setPreference(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        true,
        { workspaceId: undefined } // global
      );

      // Set workspace-specific preference to disabled
      await preferenceService.setPreference(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        false,
        { workspaceId } // workspace-specific
      );

      const isEnabled = await preferenceService.isEnabled(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.EMAIL,
        workspaceId
      );

      expect(isEnabled).toBe(false); // Workspace-specific takes precedence
    });

    it('should fall back to global preference when no workspace-specific exists', async () => {
      const workspaceId = uuidv4();
      const recipientId = uuidv4();

      // Set only global preference
      await preferenceService.setPreference(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.SMS,
        false // disabled globally
      );

      const isEnabled = await preferenceService.isEnabled(
        recipientId,
        RecipientType.ACTOR,
        NotificationChannel.SMS,
        workspaceId
      );

      expect(isEnabled).toBe(false); // Falls back to global
    });
  });
});
