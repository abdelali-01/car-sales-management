'use client'
import React, { useEffect, useState } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import axios from 'axios';
import { Mail, MailOpen, Trash2, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  seen: boolean;
  createdAt: string;
}

// Helper function to format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { t } = useTranslation('admin');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(process.env.NEXT_PUBLIC_SERVER + '/api/messages', { withCredentials: true });
      setMessages(res.data.messages || []);
    } catch {
      setMessages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    setActionLoading(id);
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_SERVER}/api/messages/${id}/read`, {}, { withCredentials: true });
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, seen: true } : msg));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
    setActionLoading(null);
  };

  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (messageToDelete === null) return;
    setActionLoading(messageToDelete);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/messages/${messageToDelete}`, { withCredentials: true });
      setMessages(prev => prev.filter(msg => msg.id !== messageToDelete));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
    setActionLoading(null);
    setDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  const unseenCount = messages.filter(m => !m.seen).length;

  return (
    <div>
      <PageBreadcrumb pageTitle={t('messages.title')} />
      <ComponentCard title={t('messages.title')}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-brand-500" />
            <span>{t('messages.title')}</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-normal">
            <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{messages.length}</span> {t('messages.total')}
            </span>
            {unseenCount > 0 && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-medium">{unseenCount}</span> {t('messages.unread')}
              </span>
            )}
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mb-4"></div>
            <span className="text-gray-500 dark:text-gray-400">{t('messages.loading')}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <MailOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('messages.noMessages')}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              {t('messages.noMessagesDescription')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`group relative rounded-xl border p-5 transition-all duration-200 hover:shadow-lg ${msg.seen
                  ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  : 'bg-gradient-to-r from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-900 border-amber-300 dark:border-amber-700'
                  }`}
              >
                {/* Status indicator bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${msg.seen ? 'bg-green-500' : 'bg-amber-500'
                  }`}></div>

                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.seen
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : 'bg-amber-100 dark:bg-amber-900/50'
                      }`}>
                      <User className={`w-5 h-5 ${msg.seen ? 'text-gray-500' : 'text-amber-600 dark:text-amber-400'
                        }`} />
                    </div>

                    {/* Name and email */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 dark:text-white">{msg.name}</span>
                        {/* Status badge */}
                        {msg.seen ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            <CheckCircle className="w-3 h-3" />
                            {t('messages.read')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                            </span>
                            {t('messages.new')}
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-sm text-brand-500 hover:text-brand-600 hover:underline transition-colors"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  {/* Time and actions */}
                  <div className="flex items-center gap-3 md:ml-auto">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {getRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Subject if exists */}
                {msg.subject && (
                  <div className="mb-2 font-medium text-gray-800 dark:text-gray-200">
                    {msg.subject}
                  </div>
                )}

                {/* Message content */}
                <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-4 pl-13">
                  {msg.message}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pl-13">
                  {!msg.seen && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      disabled={actionLoading === msg.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                        bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400
                        hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === msg.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-brand-500"></div>
                      ) : (
                        <MailOpen className="w-3.5 h-3.5" />
                      )}
                      {t('messages.markAsRead')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(msg.id)}
                    disabled={actionLoading === msg.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                      bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400
                      hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('messages.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ComponentCard>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('messages.deleteTitle')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('messages.deleteWarning')}</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('messages.deleteConfirm')}
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                  bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                  transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={actionLoading !== null}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
                  hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2"
              >
                {actionLoading !== null ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {t('messages.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
