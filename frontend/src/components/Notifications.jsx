import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Plane } from 'lucide-react';
import {
  subscribeToFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  subscribeToSharedTrips,
} from '../services/firestoreService';

export default function Notifications({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [sharedTrips, setSharedTrips] = useState([]);
  const [processing, setProcessing] = useState(null); // requestId being processed
  const dropdownRef = useRef(null);

  // Real-time subscription to pending friend requests
  useEffect(() => {
    if (!user?.email) return;
    const unsub = subscribeToFriendRequests(user.email, setRequests);
    return () => unsub();
  }, [user?.email]);

  // Real-time subscription to shared trips (show new ones as notifications)
  const [seenSharedIds, setSeenSharedIds] = useState(new Set());
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToSharedTrips(user.uid, (trips) => {
      // Only show trips created by others as notifications
      const fromOthers = trips.filter(t => t.createdBy !== user.uid);
      setSharedTrips(fromOthers);
    });
    return () => unsub();
  }, [user?.uid]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccept = async (requestId) => {
    setProcessing(requestId);
    try {
      await acceptFriendRequest(requestId, user);
    } catch (err) {
      console.error('Accept failed:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessing(requestId);
    try {
      await rejectFriendRequest(requestId);
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setProcessing(null);
    }
  };

  const dismissSharedTrip = (tripId) => {
    setSeenSharedIds(prev => new Set([...prev, tripId]));
  };

  // Filter out already-seen shared trips for badge count
  const unseenSharedTrips = sharedTrips.filter(t => !seenSharedIds.has(t.id));
  const totalCount = requests.length + unseenSharedTrips.length;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'transparent', border: 'none',
          cursor: 'pointer', padding: '4px',
          display: 'flex', alignItems: 'center',
        }}
        aria-label={`Notifications (${totalCount} pending)`}
      >
        <Bell size={24} color="var(--ink-black)" fill={totalCount > 0 ? 'var(--marker-yellow)' : 'none'} />
        {totalCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: 'var(--marker-red)', color: 'white',
              width: '20px', height: '20px', borderRadius: '50%',
              fontSize: '0.75rem', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--ink-black)',
              fontFamily: 'Nunito, sans-serif',
            }}
          >
            {totalCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '40px', right: 0,
              width: '340px', maxHeight: '450px', overflowY: 'auto',
              background: 'var(--paper-white)',
              border: '3px solid var(--ink-black)',
              borderRadius: '12px',
              boxShadow: '6px 6px 0px var(--ink-black)',
              zIndex: 1001,
            }}
          >
            <div style={{
              padding: '1rem', borderBottom: '2px dashed var(--ink-black)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Bell size={20} color="var(--ink-black)" />
              <span className="cartoon-font" style={{ fontSize: '1.5rem', color: 'var(--ink-black)' }}>
                Notifications
              </span>
            </div>

            {/* Shared Trip Notifications */}
            {unseenSharedTrips.length > 0 && (
              <div style={{ padding: '0.5rem' }}>
                {unseenSharedTrips.map((trip) => (
                  <div key={trip.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '0.75rem', margin: '0.25rem 0',
                    border: '2px solid var(--ink-black)', borderRadius: '8px',
                    background: '#eef6ff', boxShadow: '2px 2px 0px var(--ink-black)',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      border: '2px solid var(--ink-black)',
                      background: 'var(--marker-green)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '1rem', flexShrink: 0,
                    }}>
                      <Plane size={18} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 'bold', fontFamily: 'Nunito, sans-serif',
                        fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        ✈️ {trip.destination || 'A trip'}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'Nunito, sans-serif' }}>
                        shared by <strong>{trip.creatorName || 'a friend'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissSharedTrip(trip.id)}
                      style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        border: '2px solid var(--ink-black)',
                        background: 'white', color: 'var(--ink-black)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '1px 1px 0px var(--ink-black)',
                        flexShrink: 0,
                      }}
                      aria-label="Dismiss"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Friend Request Notifications */}
            {requests.length === 0 && unseenSharedTrips.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <p className="cartoon-font" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: 0 }}>
                  All caught up!
                </p>
              </div>
            ) : requests.length > 0 && (
              <div style={{ padding: '0.5rem' }}>
                {requests.map((req) => (
                  <div key={req.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '0.75rem', margin: '0.25rem 0',
                    border: '2px solid var(--ink-black)', borderRadius: '8px',
                    background: 'white', boxShadow: '2px 2px 0px var(--ink-black)',
                  }}>
                    {/* Avatar */}
                    {req.fromPhoto ? (
                      <img src={req.fromPhoto} alt="" style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: '2px solid var(--ink-black)', objectFit: 'cover', flexShrink: 0,
                      }} />
                    ) : (
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        border: '2px solid var(--ink-black)',
                        background: 'var(--marker-blue)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '1rem', flexShrink: 0,
                      }}>
                        {(req.fromName || req.fromEmail)[0].toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 'bold', fontFamily: 'Nunito, sans-serif',
                        fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {req.fromName}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontFamily: 'Nunito, sans-serif' }}>
                        wants to be travel buddies!
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      <button
                        onClick={() => handleAccept(req.id)}
                        disabled={processing === req.id}
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: '2px solid var(--ink-black)',
                          background: 'var(--marker-green)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: processing === req.id ? 'wait' : 'pointer',
                          boxShadow: '2px 2px 0px var(--ink-black)',
                        }}
                        aria-label="Accept"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={processing === req.id}
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          border: '2px solid var(--ink-black)',
                          background: 'var(--marker-red)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: processing === req.id ? 'wait' : 'pointer',
                          boxShadow: '2px 2px 0px var(--ink-black)',
                        }}
                        aria-label="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
