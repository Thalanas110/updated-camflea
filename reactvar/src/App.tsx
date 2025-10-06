import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PostItemPage from './pages/PostItemPage';
import EditItemPage from './pages/EditItemPage';
import DetailedPostPage from './pages/DetailedPostPage';
import ViewProfilePage from './pages/ViewProfilePage';
import MessagePage from './pages/MessagePage';
import ConversationPage from './pages/ConversationPage';
import AdminPage from './pages/AdminPage';
import NotificationPage from './pages/NotificationPage';
import TransactionPage from './pages/TransactionPage';
import FeedbackPage from './pages/FeedbackPage';
import ReportPage from './pages/ReportPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Item Management */}
            <Route path="/post-item" element={<PostItemPage />} />
            <Route path="/edit-item/:id" element={<EditItemPage />} />
            <Route path="/item/:id" element={<DetailedPostPage />} />
            
            {/* User Pages */}
            <Route path="/profile/:id" element={<ViewProfilePage />} />
            <Route path="/profile" element={<ViewProfilePage />} />
            
            {/* Messaging */}
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/conversations" element={<ConversationPage />} />
            
            {/* Admin */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Other Features */}
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
