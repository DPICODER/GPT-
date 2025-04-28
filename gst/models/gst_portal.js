const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const gst_portal = sequelize.define('gst_portal', {
    po_no: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      gst_supplier: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      invoice_no: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      invoice_type: {
        type: DataTypes.ENUM('Goods', 'Services'),
        allowNull: false
      },
      taxable_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
      state_tax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
      central_tax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },
      month: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      plant_no: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      miro_no: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      miro_year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      migo_no: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      migo_year: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    tableName: 'gst_portal', // The name of the table in the database
    timestamps: false, // Disable timestamps if your table doesn't have `createdAt` and `updatedAt`
  });

module.exports = {gst_portal};