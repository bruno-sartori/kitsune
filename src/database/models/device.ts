import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import User from './user';
import { v4 as uuidv4 } from 'uuid';

export interface DeviceAttributes {
  id?: string;
  name: string;
  type: 'keyboard' | 'mouse';
  group: 'light';
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Device extends Model<DeviceAttributes> implements DeviceAttributes {
  public id!: string;
  public name!: string;
  public type!: 'keyboard' | 'mouse';
  public group!: 'light';
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Device.init({
  id: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('keyboard', 'mouse'),
    allowNull: false,
  },
  group: {
    type: DataTypes.ENUM('light'),
    allowNull: false,  
  },
  userId: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  hooks: {
    beforeCreate: (file) => {
      file.id = uuidv4();
    }
  },
  sequelize: connection,
  modelName: 'Device',
});

Device.belongsTo(User, {
  as: 'user',
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  foreignKeyConstraint: true,
});

export default Device;
