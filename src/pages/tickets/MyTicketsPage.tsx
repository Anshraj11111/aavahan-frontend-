import { useState } from 'react';
import { Search, Download, QrCode, Calendar, MapPin, Clock } from 'lucide-react';
import { formatDate } from '../../utils';

const MyTicketsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - will be replaced with actual API calls
  const mockTickets = [
    {
      id: 'SRGTF2026-001234',
      eventTitle: 'Hackathon 2026',
      eventDay: 2,
      date: '2026-04-02',
      time: '09:00 AM',
      venue: 'Computer Lab A',
      status: 'approved',
      qrCodeUrl: '/images/qr-sample.png',
      participantName: 'John Doe',
      teamName: 'Code Warriors'
    },
    {
      id: 'SRGTF2026-001235',
      eventTitle: 'Cultural Night',
      eventDay: 1,
      date: '2026-04-01',
      time: '07:00 PM',
      venue: 'Main Auditorium',
      status: 'pending',
      participantName: 'John Doe'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              My Tickets
            </h1>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              View and manage your Tech Fest 2026 event tickets. Download QR codes 
              for approved registrations and check your registration status.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by registration ID, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tickets List */}
      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {mockTickets.length === 0 ? (
              <div className="text-center py-16">
                <QrCode className="w-24 h-24 text-white/30 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  No Tickets Found
                </h3>
                <p className="text-white/70 mb-8">
                  You don't have any event registrations yet. Register for events to see your tickets here.
                </p>
                <a href="/events" className="btn-primary">
                  Browse Events
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {mockTickets.map((ticket) => (
                  <div key={ticket.id} className="glass p-6 rounded-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      {/* Ticket Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {ticket.eventTitle}
                            </h3>
                            <p className="text-white/60 text-sm mb-2">
                              Registration ID: {ticket.id}
                            </p>
                            <p className="text-white/80">
                              Participant: {ticket.participantName}
                            </p>
                            {ticket.teamName && (
                              <p className="text-white/80">
                                Team: {ticket.teamName}
                              </p>
                            )}
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              ticket.status === 'approved' 
                                ? 'bg-green-500 text-white'
                                : ticket.status === 'pending'
                                ? 'bg-yellow-500 text-black'
                                : 'bg-red-500 text-white'
                            }`}>
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-white/60">
                            <Calendar size={16} />
                            <span>Day {ticket.eventDay} - {formatDate(ticket.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/60">
                            <Clock size={16} />
                            <span>{ticket.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/60">
                            <MapPin size={16} />
                            <span>{ticket.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-3">
                        {ticket.status === 'approved' && ticket.qrCodeUrl ? (
                          <>
                            <button className="btn-primary flex items-center justify-center space-x-2">
                              <QrCode size={16} />
                              <span>View QR Code</span>
                            </button>
                            <button className="btn-outline flex items-center justify-center space-x-2">
                              <Download size={16} />
                              <span>Download Ticket</span>
                            </button>
                          </>
                        ) : ticket.status === 'pending' ? (
                          <div className="text-center">
                            <p className="text-yellow-400 text-sm mb-2">
                              Registration under review
                            </p>
                            <p className="text-white/60 text-xs">
                              You'll receive your ticket once approved
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-red-400 text-sm mb-2">
                              Registration rejected
                            </p>
                            <p className="text-white/60 text-xs">
                              Contact support for more information
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need Help?
            </h3>
            <p className="text-white/70 mb-8">
              Can't find your tickets or having issues with your registration? 
              We're here to help you get ready for Tech Fest 2026.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="/ticket-lookup" className="btn-outline">
                Lookup Tickets
              </a>
              <a href="/contact" className="btn-primary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyTicketsPage;