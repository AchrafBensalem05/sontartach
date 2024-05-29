const mongoose = require('mongoose');
const db = require('./app/models');
const Role = db.role;

mongoose.connect('mongodb://localhost:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const roles = [
  { name: 'viewer' },
  { name: 'inspectionAdmin' },
  { name: 'pipeAdmin' },
  { name: 'wellAdmin' },
  {name:  'admin'}
];

const createRoles = async () => {
  for (let roleData of roles) {
    const role = await Role.findOne({ name: roleData.name });
    if (!role) {
      await new Role(roleData).save();
    }
  }
  mongoose.disconnect();
};

createRoles()
  .then(() => console.log('Roles are ensured'))
  .catch(err => console.error('Error ensuring roles', err));
