import cds from '@sap/cds';
import nodemailer from 'nodemailer';

const LOG = cds.log('spacefarer');

export default class SpacefarerService extends cds.ApplicationService {
  async init() {
    const { Spacefarers } = this.entities;
    const Targets = Spacefarers.drafts ? [Spacefarers, Spacefarers.drafts] : Spacefarers;

    // Create an automatic Ethereal test inbox for local development
    let transporter;
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      LOG.info('📬 [EMAIL SERVICE READY] Using Ethereal virtual mail server.');
    } catch (err) {
      LOG.warn('⚠️ Could not connect to Ethereal mail server, using local fallback logger.', err.message);
      transporter = {
        sendMail: async (options) => {
          LOG.info(`📨 [SIMULATED EMAIL] To: ${options.to} | Subject: ${options.subject}`);
          return { messageId: 'simulated-id' };
        },
      };
    }

    // =========================================================================
    // 1. @Before Event: Planet Check, Validation, & Skill Enhancement
    // =========================================================================
    this.before(['CREATE', 'NEW'], Targets, async (req) => {
      const candidate = req.data;

      // CHECK 1: Planet Isolation on INSERT
      if (!req.user.is('GalacticCommander')) {
        const userPlanet = req.user.attr?.planet;

        if (candidate.originPlanet_code && candidate.originPlanet_code !== userPlanet) {
          return req.error(
            403,
            `Forbidden: Officers from ${userPlanet} cannot enlist spacefarers for ${candidate.originPlanet_code}!`
          );
        }

        candidate.originPlanet_code = userPlanet;
      }

      // CHECK 2: Validate Stardust Collection
      if (candidate.stardustCollection < 0) {
        return req.error(
          400,
          'Stardust collection cannot be negative. Cosmic laws forbid negative matter!'
        );
      }

      // CHECK 3: Skill Enhancement
      if (candidate.stardustCollection >= 500) {
        const initialSkill = candidate.wormholeNavigationSkill || 10;
        candidate.wormholeNavigationSkill = initialSkill + 20;
        LOG.info(`✨ [COSMIC ENHANCEMENT] Navigation skill boosted to ${candidate.wormholeNavigationSkill}!`);
      }

      if (!candidate.spacesuitColor) {
        candidate.spacesuitColor = 'Standard Nebula Blue';
      }
    });

    // =========================================================================
    // 2. @After Event: Send REAL Congratulatory Email
    // =========================================================================
    this.after('CREATE', Spacefarers, async (spacefarer, req) => {
      const name = spacefarer?.name || req.data?.name || 'Spacefarer';
      const recipient = spacefarer?.email || 'attila.balind.repo@proton.me';
      const planet = spacefarer?.originPlanet_code || req.data?.originPlanet_code || 'Uncharted Sector';
      const suitColor = spacefarer?.spacesuitColor || req.data?.spacesuitColor || 'Nebula Blue';
      const stardust = spacefarer?.stardustCollection ?? req.data?.stardustCollection ?? 0;
      const skill = spacefarer?.wormholeNavigationSkill ?? req.data?.wormholeNavigationSkill ?? 10;

      const mailOptions = {
        from: '"Starfleet Galactic Command 🛸" <command@starfleet.galaxy>',
        to: recipient,
        subject: `🌌 Welcome to the Stars, Spacefarer ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0b0f19; color: #ffffff; padding: 25px; border-radius: 10px;">
            <h1 style="color: #4da6ff;">🚀 Galactic Spacefarer Adventure</h1>
            <p>Greetings <strong>${name}</strong>,</p>
            <p>Congratulations! You have officially embarked on your adventurous journey across the SAP galaxy.</p>
            <hr style="border: 1px solid #1f2937;" />
            <h3>Your Starfleet Credentials:</h3>
            <ul>
              <li><strong>Origin Planet:</strong> ${planet}</li>
              <li><strong>Spacesuit Color:</strong> ${suitColor}</li>
              <li><strong>Stardust Collection:</strong> ${stardust} grams</li>
              <li><strong>Wormhole Navigation Skill:</strong> ${skill} / 100</li>
            </ul>
            <p style="color: #a0aec0;">May the stars always guide your course through the wormholes!</p>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        LOG.info(`🚀 [REAL EMAIL SENT] To: ${recipient}`);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          LOG.info(`🔗 PREVIEW LINK: ${previewUrl}`);
        }
      } catch (err) {
        LOG.error('Failed to dispatch cosmic email:', err);
      }
    });




    // =========================================================================
    // 3. CUSTOM ACTION: embark (The Journey Begins!)
    // =========================================================================
    // Before embarking: Validate skills & destination



    
    this.before('embark', Spacefarers, async (req) => {
      const { destinationPlanet } = req.data;
      if (!destinationPlanet) {
        return req.error(400, 'Destination planet must be specified to plot navigation vectors!');
      }
      // Retrieve the current spacefarer from DB
      const [spacefarer] = await SELECT.from(req.subject);
      if (!spacefarer) {
        return req.error(404, 'Spacefarer not found!');
      }
      // Business Rule: Wormhole navigation skill must be at least 40 to embark
      if ((spacefarer.wormholeNavigationSkill || 0) < 40) {
        return req.error(
          400,
          `Launch Aborted! ${spacefarer.name}'s navigation skill (${spacefarer.wormholeNavigationSkill}) is below minimum safe threshold (40).`
        );
      }
      if (spacefarer.originPlanet_code === destinationPlanet) {
        LOG.info('destination = ', destinationPlanet);
        LOG.info('originPlanet = ', spacefarer.originPlanet_code);
        return req.error(
          400,
          `Launch Aborted! You cannot travel to your origin planet (${spacefarer.originPlanet_code}).`
        );
      }
    });

    // On embarking: Execute the launch & consume 50 grams of stardust for wormhole warp fuel!
    this.on('embark', Spacefarers, async (req) => {
      const { destinationPlanet } = req.data;
      const [spacefarer] = await SELECT.from(req.subject);
      // Consume 50 stardust fuel (or down to 0)
      const newStardust = Math.max(0, (spacefarer.stardustCollection || 0) - 50);
      await UPDATE(req.subject).with({
        stardustCollection: newStardust,
      });
      LOG.info(
        `🌟 [LAUNCH SUCCESSFUL] ${spacefarer.name} embarked for ${destinationPlanet}! Fuel consumed. Remaining stardust: ${newStardust}`
      );
      // Return the updated spacefarer
      return await SELECT.one.from(req.subject);
    });

    // After embarking: Send the Mission Departure notification!
    this.after('embark', Spacefarers, async (spacefarer, req) => {
      const recipient = spacefarer?.email || 'attila.balind.repo@proton.me';
      const destination = req.data.destinationPlanet;
      const mailOptions = {
        from: '"Mission Control 🪐" <control@starfleet.galaxy>',
        to: recipient,
        subject: `🌠 Mission Launch Confirmed: En route to ${destination}!`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #0b0f19; color: #ffffff; padding: 25px; border-radius: 10px;">
            <h1 style="color: #00ffaa;">🛸 Warp Drive Engaged!</h1>
            <p>Greetings Spacefarer <strong>${spacefarer.name}</strong>,</p>
            <p>Your coordinates have been locked for <strong>${destination}</strong>. Safe travels through the wormhole!</p>
            <p>Remaining Stardust Fuel: <strong>${spacefarer.stardustCollection} grams</strong></p>
          </div>
        `,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        LOG.info(`🚀 [DEPARTURE EMAIL SENT] To: ${recipient}`);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          LOG.info(`🔗 PREVIEW LINK: ${previewUrl}`);
        }
      } catch (err) {
        LOG.error('Failed to dispatch departure email:', err);
      }
    });

    return super.init();
  }
}
