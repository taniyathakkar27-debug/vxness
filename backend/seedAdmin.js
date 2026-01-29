import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Admin from './models/Admin.js'

dotenv.config()

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ role: 'SUPER_ADMIN' })
    if (existingAdmin) {
      console.log('Super Admin already exists!')
      console.log('Email:', existingAdmin.email)
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10)

    // Create Super Admin
    const superAdmin = new Admin({
      email: 'admin@vxness.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1234567890',
      role: 'SUPER_ADMIN',
      urlSlug: 'main',
      brandName: 'Vxness',
      status: 'ACTIVE',
      permissions: {
        // User Management
        canManageUsers: true,
        canCreateUsers: true,
        canDeleteUsers: true,
        canViewUsers: true,
        
        // Trading Management
        canManageTrades: true,
        canCloseTrades: true,
        canModifyTrades: true,
        
        // Account Management
        canManageAccounts: true,
        canCreateAccounts: true,
        canDeleteAccounts: true,
        canModifyLeverage: true,
        
        // Wallet/Finance
        canManageDeposits: true,
        canApproveDeposits: true,
        canManageWithdrawals: true,
        canApproveWithdrawals: true,
        
        // KYC
        canManageKYC: true,
        canApproveKYC: true,
        
        // IB Management
        canManageIB: true,
        canApproveIB: true,
        
        // Copy Trading
        canManageCopyTrading: true,
        canApproveMasters: true,
        
        // Settings
        canManageSymbols: true,
        canManageGroups: true,
        canManageSettings: true,
        canManageTheme: true,
        
        // Reports
        canViewReports: true,
        canExportReports: true,
        
        // Admin Management
        canManageAdmins: true,
        canFundAdmins: true
      }
    })

    await superAdmin.save()

    console.log('\n========================================')
    console.log('  SUPER ADMIN CREATED SUCCESSFULLY!')
    console.log('========================================')
    console.log('\n  Login Credentials:')
    console.log('  ------------------')
    console.log('  Email:    admin@vxness.com')
    console.log('  Password: Admin@123')
    console.log('\n  ⚠️  Please change the password after first login!')
    console.log('========================================\n')

    process.exit(0)
  } catch (error) {
    console.error('Error creating super admin:', error)
    process.exit(1)
  }
}

createSuperAdmin()
