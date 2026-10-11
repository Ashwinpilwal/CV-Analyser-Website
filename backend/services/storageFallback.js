const bcrypt = require('bcryptjs');

// In-memory collections
const users = [];
const analyses = [];

// Seed demo user for testing
(async () => {
  const hash = await bcrypt.hash('demo1234', 10);
  users.push({
    _id: 'user_demo_101',
    name: 'Elena Rostova',
    email: 'demo@auracv.ai',
    password: hash,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    createdAt: new Date(),
  });
})();

const memStore = {
  // User operations
  async findUserByEmail(email) {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    const user = users.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  async createUser({ name, email, password, avatar }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: 'user',
      createdAt: new Date(),
      matchPassword: async function (entered) {
        return await bcrypt.compare(entered, this.password);
      },
    };
    users.push(newUser);
    return newUser;
  },

  // Analysis operations
  async createAnalysis(data) {
    const item = {
      _id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    analyses.unshift(item);
    return item;
  },

  async getAnalysesByUser(userId) {
    return analyses.filter(
      (a) => a.user && a.user.toString() === userId.toString()
    );
  },

  async getAnalysisById(id) {
    return analyses.find((a) => a._id.toString() === id.toString()) || null;
  },

  async deleteAnalysis(id, userId) {
    const index = analyses.findIndex(
      (a) => a._id.toString() === id.toString() && (!userId || a.user.toString() === userId.toString())
    );
    if (index !== -1) {
      analyses.splice(index, 1);
      return true;
    }
    return false;
  },

  async getAllAnalyses() {
    return analyses;
  },
};

module.exports = memStore;
