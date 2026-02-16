import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import AdminLayout from '../components/AdminLayout'
import { 
  Gift, 
  Check, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react'
import { API_URL } from '../config/api'
import { useTheme } from '../context/ThemeContext'

const AdminCreditRequests = () => {
  const { isDarkMode } = useTheme()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(null)

  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')

  useEffect(() => {
    fetchCreditRequests()
  }, [])

  const fetchCreditRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/admin/credit-requests`)
      const data = await res.json()
      if (data.success) {
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Error fetching credit requests:', error)
      toast.error('Failed to fetch credit requests')
    }
    setLoading(false)
  }

  const handleApprove = async (requestId) => {
    setActionLoading(requestId)
    try {
      const res = await fetch(`${API_URL}/admin/credit-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: adminUser._id })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Credit request approved!')
        fetchCreditRequests()
      } else {
        toast.error(data.message || 'Failed to approve')
      }
    } catch (error) {
      toast.error('Error approving request')
    }
    setActionLoading(null)
  }

  const handleReject = async (requestId) => {
    setActionLoading(requestId)
    try {
      const res = await fetch(`${API_URL}/admin/credit-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: adminUser._id, adminNote: rejectNote })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Credit request rejected')
        setShowRejectModal(null)
        setRejectNote('')
        fetchCreditRequests()
      } else {
        toast.error(data.message || 'Failed to reject')
      }
    } catch (error) {
      toast.error('Error rejecting request')
    }
    setActionLoading(null)
  }

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status.toLowerCase() === filter
    const matchesSearch = !searchTerm || 
      req.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.tradingAccountName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length
  }

  return (
    <AdminLayout title="Credit Requests" subtitle="Manage user credit deposit requests">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
          <p className="text-gray-500 text-sm">Total Requests</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
          <p className="text-yellow-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
          <p className="text-green-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
          <p className="text-red-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border mb-6 ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user name, email, or account..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:border-purple-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'}`}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === f
                    ? 'bg-purple-500 text-white'
                    : isDarkMode 
                      ? 'bg-dark-700 text-gray-400 hover:text-white' 
                      : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={fetchCreditRequests}
              className={`px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-dark-700 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-dark-800 border-gray-800' : 'bg-white border-gray-200'}`}>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading credit requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Gift size={40} className="mx-auto mb-3 opacity-50" />
            <p>No credit requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700 bg-dark-700' : 'border-gray-200 bg-gray-50'}`}>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>User</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reason</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => (
                  <tr key={req._id} className={`border-b ${isDarkMode ? 'border-gray-800 hover:bg-dark-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{req.userId?.firstName || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">{req.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{req.tradingAccountName || req.tradingAccountId?.accountId || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">Credit: ${(req.tradingAccountId?.credit || 0).toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-purple-400 font-semibold">${req.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{req.reason || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        req.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {req.status === 'Pending' && <Clock size={12} />}
                        {req.status === 'Approved' && <CheckCircle size={12} />}
                        {req.status === 'Rejected' && <XCircle size={12} />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(req.createdAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {req.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(req._id)}
                            disabled={actionLoading === req._id}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            onClick={() => setShowRejectModal(req._id)}
                            disabled={actionLoading === req._id}
                            className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          {req.processedAt ? `Processed ${new Date(req.processedAt).toLocaleDateString()}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-md border ${isDarkMode ? 'bg-dark-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            <h3 className={`font-semibold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reject Credit Request</h3>
            <div className="mb-4">
              <label className={`block text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rejection Note (Optional)</label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
                className={`w-full border rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-red-500 ${isDarkMode ? 'bg-dark-700 border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectNote(''); }}
                className={`flex-1 py-3 rounded-lg transition-colors ${isDarkMode ? 'bg-dark-700 text-white hover:bg-dark-600' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={actionLoading === showRejectModal}
                className="flex-1 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading === showRejectModal ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCreditRequests
