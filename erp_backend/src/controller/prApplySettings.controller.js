const db = require("../models"); // adjust path as per your project
const PriceListApplySettings = db.pr_apply_settings;

module.exports = {
  // Create new record
  async saveOrUpdateSettings(req, res) {
    try {
      const { settings, pr_code, created_by } = req.body;

      if (!settings || !Array.isArray(settings) || settings.length === 0) {
        return res
          .status(400)
          .json({ status: false, message: "No settings provided" });
      }

      // We'll loop through each setting and upsert (update or create)
      const results = [];

      for (const setting of settings) {
        // Extract fields from each setting
        const {
          id, // optional, if updating
          main_company_id,
          sub_company_id,
          location_id,
          status = 1,
        } = setting;

        // If you want to check uniqueness by pr_code + main_company_id + sub_company_id + location_id,
        // you can search first and update that record instead of by id.
        // For now, let's do by id if present, else create

        if (id) {
          // Try update existing
          const existing = await PriceListApplySettings.findByPk(id);
          if (existing) {
            await existing.update({
              pr_code,
              main_company_id,
              sub_company_id,
              location_id,
              status,
            });
            results.push({ id: existing.id, action: "updated" });
            continue;
          }
          // If id provided but not found, fall back to create new
        }

        // Create new record
        const created = await PriceListApplySettings.create({
          pr_code,
          main_company_id,
          sub_company_id,
          location_id,
          status,
        });

        results.push({ id: created.id, action: "created" });
      }

      return res.json({
        status: true,
        message: "Settings processed successfully",
        results,
      });
    } catch (error) {
      console.error("Error in saveOrUpdateSettings:", error);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    }
  },

  // Get all records (optional filters can be added)
  async getAll(req, res) {
    try {
      const records = await PriceListApplySettings.findAll({
        where: { deleted_at: null }, // paranoid takes care but explicit if paranoid is off
      });
      return res.json(records);
    } catch (error) {
      console.error("Error fetching price list apply settings:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get one by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const record = await PriceListApplySettings.findByPk(id);

      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }

      return res.json(record);
    } catch (error) {
      console.error("Error fetching price list apply setting:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Update by ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const { pr_code, main_company_id, sub_company_id, location_id, status } =
        req.body;

      const record = await PriceListApplySettings.findByPk(id);

      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }

      await record.update({
        pr_code,
        main_company_id,
        sub_company_id,
        location_id,
        status,
      });

      return res.json(record);
    } catch (error) {
      console.error("Error updating price list apply setting:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Soft delete by ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const record = await PriceListApplySettings.findByPk(id);

      if (!record) {
        return res.status(404).json({ error: "Record not found" });
      }

      await record.destroy(); // paranoid soft delete

      return res.json({ message: "Record deleted successfully" });
    } catch (error) {
      console.error("Error deleting price list apply setting:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
