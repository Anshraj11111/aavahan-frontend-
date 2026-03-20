import { useState } from 'react';
import { Search, Ticket, User, Calendar, MapPin, Clock, Download, CheckCircle, XCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { registrationsService } from '../../services/registrations';
import { Registration } from '../../types';
import { formatDate } from '../../utils';

const TicketLookupPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'registration' | 'email'>('registration');
  const [searchResult, setSearchResult] = useState<Registration | null>(null);

  const searchMutation = useMutation({
    mutationFn: ({ query, type }: { query: string; type: 'registration' | 'email' }) =>
      registrationsService.searchRegistration(query, type),
    onSuccess: (response) => {
      setSearchResult(response.data);
      toast.success('Registration found!');
    },
    onError: (error: any) => {
      setSearchResult(null);
      toast.error(error.error || 'No registration found with the provided details');
    },
  });

  const downloadMutation = useMutation({
    mutationFn: (registrationId: string) =>
      registrationsService.downloadTicket(registrationId),
    onSuccess: () => {
      toast.success('Ticket download started!');
    },
    onError: (error: any) => {
      toast.error(error.error || 'Download failed');
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }
    searchMutation.mutate({ query: searchQuery.trim(), type: searchType });
  };

  const downloadTicket = () => {
    if (searchResult) {
      downloadMutation.mutate(searchResult._id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'text-green-400';
      case 'pending':
      case 'pending_verification':
        return 'text-yellow-400';
      case 'rejected':
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ticket Lookup
            </h1>
            <p className="text-white/80 text-xl max-w-3xl mx-auto">
              Find your registration details and download your ticket using your 
              registration ID or email address.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="glass p-8 rounded-2xl mb-8">
              <form onSubmit={handleSearch}>
                <div className="mb-6">
                  <label className="block text-white font-medium mb-4">
                    Search by:
                  </label>
                  <div className="flex space-x-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setSearchType('registration')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                        searchType === 'registration'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      Registration ID
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('email')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                        searchType === 'email'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      Email Address
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">
                    {searchType === 'registration' ? 'Registration ID' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <input
                      type={searchType === 'email' ? 'email' : 'text'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        searchType === 'registration' 
                          ? 'e.g., SRGTF2026-001234' 
                          : 'e.g., john.doe@example.com'
                      }
                      className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
                      required
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  </div>
                  {searchType === 'registration' && (
                    <p className="text-white/60 text-sm mt-2">
                      Registration ID format: SRGTF2026-XXXXXX
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={searchMutation.isPending}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {searchMutation.isPending ? (
                    <>
                      <div className="spinner w-5 h-5" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Search Registration</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {searchResult && (
              <div className="glass p-8 rounded-2xl animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Registration Found</h2>
                  <Ticket className="w-8 h-8 text-primary-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white/60 text-sm">Full Name</p>
                        <p className="text-white font-medium">{searchResult.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Ticket className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white/60 text-sm">Registration ID</p>
                        <p className="text-white font-medium font-mono">{searchResult.uniqueRegistrationId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 text-white/60">@</span>
                      <div>
                        <p className="text-white/60 text-sm">Email</p>
                        <p className="text-white font-medium">{searchResult.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 text-white/60">📱</span>
                      <div>
                        <p className="text-white/60 text-sm">Phone</p>
                        <p className="text-white font-medium">{searchResult.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Event Information</h3>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white/60 text-sm">Event</p>
                        <p className="text-white font-medium">{searchResult.eventTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white/60 text-sm">Date</p>
                        <p className="text-white font-medium">
                          Day {searchResult.eventDay} - {formatDate(searchResult.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white/60 text-sm">Amount</p>
                        <p className="text-white font-medium">₹{searchResult.amountExpected}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-white/60" />
                      <div>
                        <p className="text-white/60 text-sm">Participation</p>
                        <p className="text-white font-medium capitalize">
                          {searchResult.participationType}
                          {searchResult.teamName && ` - ${searchResult.teamName}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(searchResult.registrationStatus)}
                      <div>
                        <p className="text-white/60 text-sm">Registration</p>
                        <p className={`font-medium capitalize ${getStatusColor(searchResult.registrationStatus)}`}>
                          {searchResult.registrationStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(searchResult.paymentStatus)}
                      <div>
                        <p className="text-white/60 text-sm">Payment</p>
                        <p className={`font-medium capitalize ${getStatusColor(searchResult.paymentStatus)}`}>
                          {searchResult.paymentStatus}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {searchResult.checkedIn ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-white/60 text-sm">Check-in</p>
                        <p className={`font-medium ${searchResult.checkedIn ? 'text-green-400' : 'text-red-400'}`}>
                          {searchResult.checkedIn ? 'Checked In' : 'Not Checked In'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {searchResult.registrationStatus === 'approved' && searchResult.paymentStatus === 'paid' && (
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={downloadTicket}
                      disabled={downloadMutation.isPending}
                      className="btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {downloadMutation.isPending ? (
                        <>
                          <div className="spinner w-5 h-5" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download size={20} />
                          <span>Download Ticket</span>
                        </>
                      )}
                    </button>
                    <button className="btn-outline flex items-center justify-center space-x-2">
                      <span>📱</span>
                      <span>Add to Wallet</span>
                    </button>
                  </div>
                )}

                {searchResult.registrationStatus !== 'approved' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      <strong>Note:</strong> Your registration is still under review. 
                      You'll be able to download your ticket once it's approved.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="glass p-6 rounded-xl mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <div className="space-y-3 text-white/70">
                <p>• Registration ID can be found in your confirmation email</p>
                <p>• Use the same email address you used during registration</p>
                <p>• Contact support if you can't find your registration</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Support: <a href="mailto:info@srigroup.net" className="text-primary-400 hover:text-primary-300">info@srigroup.net</a> | 
                  Phone: <a href="tel:+919755042292" className="text-primary-400 hover:text-primary-300">+91 9755042292</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketLookupPage;
