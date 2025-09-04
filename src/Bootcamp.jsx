import React from 'react';
import { Calendar, MapPin, Users, Brain, Trophy, Waves, Sun, Clock, User, Coffee, BookOpen, TrendingUp, PartyPopper, Star } from 'lucide-react';

const BootcampSchedule = () => {
  const scheduleData = [
    {
      date: "9 Sept",
      dayName: "Marți",
      color: "from-blue-500 to-cyan-400",
      activities: [
        { time: "După amiază", title: "Mingle / Socializare", type: "social", icon: Users }
      ]
    },
    {
      date: "10 Sept",
      dayName: "Miercuri", 
      color: "from-purple-500 to-pink-400",
      activities: [
        { time: "03:45-07:00", title: "Mihai Vlada (Asia)", type: "session", icon: TrendingUp },
        { time: "08:30-09:30", title: "Flavius Londra live", type: "live", icon: Star },
        { time: "10:00-11:00", title: "John (Analiza săpt.)", type: "analysis", icon: BookOpen },
        { time: "11:00-12:00", title: "Darius Hotima - Psihologie", type: "session", icon: Brain },
        { time: "12:00-14:00", title: "Pauza de masă", type: "break", icon: Coffee },
        { time: "14:30-16:00", title: "Flavius Live/Știri", type: "live", icon: Star },
        { time: "16:00-17:00", title: "Mihai Tiepac", type: "session", icon: TrendingUp },
        { time: "17:00", title: "Plajă", type: "beach", icon: Waves }
      ]
    },
    {
      date: "11 Sept",
      dayName: "Joi",
      color: "from-green-500 to-emerald-400", 
      activities: [
        { time: "03:45-07:00", title: "Mihai Vlada (Asia)", type: "session", icon: TrendingUp },
        { time: "08:15-11:00", title: "Flavius Londra Live", type: "live", icon: Star },
        { time: "11:00-12:00", title: "Mihai Vlada", type: "session", icon: User },
        { time: "12:00-12:30", title: "Darius Hotima - Psihologie", type: "practice", icon: Brain },
        { time: "12:30-14:00", title: "Pauza", type: "break", icon: Coffee },
        { time: "14:00-16:00", title: "Live Trading + Știri", type: "trading", icon: TrendingUp },
        { time: "16:00-17:00", title: "Julia", type: "session", icon: User }
      ]
    },
    {
      date: "12 Sept", 
      dayName: "Vineri",
      color: "from-orange-500 to-red-400",
      activities: [
        { time: "03:45-07:00", title: "Mihai Vlada (Asia)", type: "session", icon: TrendingUp },
        { time: "08:00-10:00", title: "Flavius Londra live", type: "live", icon: Star },
        { time: "10:00-11:00", title: "Macroeconomie - John", type: "theory", icon: BookOpen },
        { time: "11:00-12:00", title: "Testimoniale Eric + Mentori", type: "testimonial", icon: Users },
        { time: "14:00-16:00", title: "Flavius Live & Știri", type: "live", icon: Star },
        { time: "16:00-17:00", title: "Darius Hotima - Psihologie", type: "session", icon: Brain }
      ]
    },
    {
      date: "13 Sept",
      dayName: "Sâmbătă",
      color: "from-indigo-500 to-purple-400",
      activities: [
        { time: "12:00-13:00", title: "Darius Hotima - Psihologie", type: "practice", icon: Brain },
        { time: "13:00-14:00", title: "Mihai Tiepac", type: "session", icon: TrendingUp },
        { time: "14:30-15:00", title: "Sergiu Cîrstea", type: "session", icon: User },
        { time: "Seara", title: "White Party - Fun 🎉", type: "party", icon: PartyPopper }
      ]
    }
  ];

  const getActivityTypeStyles = (type) => {
    const styles = {
      social: "bg-blue-100 text-blue-700",
      session: "bg-gray-100 text-gray-700", 
      live: "bg-red-100 text-red-700",
      analysis: "bg-green-100 text-green-700",
      break: "bg-yellow-100 text-yellow-700",
      beach: "bg-cyan-100 text-cyan-700",
      practice: "bg-purple-100 text-purple-700",
      trading: "bg-emerald-100 text-emerald-700",
      theory: "bg-indigo-100 text-indigo-700",
      testimonial: "bg-pink-100 text-pink-700",
      party: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
    };
    return styles[type] || styles.session;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 print:bg-white print:text-black">
      {/* Compact Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 print:bg-gray-100 print:border-b-2 print:border-gray-300">
        <div className="absolute bottom-0 left-0 right-0 print:hidden">
          <svg viewBox="0 0 1440 60" className="w-full h-8 fill-slate-900">
            <path d="M0,32L48,34.7C96,37,192,43,288,40C384,37,480,27,576,24C672,21,768,27,864,34.7C960,43,1056,53,1152,56C1248,59,1344,53,1392,50.7L1440,48L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z"></path>
          </svg>
        </div>
        
        <div className="relative px-4 py-6 text-center text-white print:text-black print:py-4">
          <h1 className="text-2xl font-bold mb-2 print:text-black">
            Bootcamp ProFX
          </h1>
          <div className="flex items-center justify-center gap-3 mb-2 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>9-14 Septembrie</span>
            </div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Eforie Nord</span>
            </div>
          </div>
          <p className="text-sm opacity-90 print:opacity-100">
            5 zile intense de educație și practică alături de traderi pasionați
          </p>
        </div>
      </div>

      {/* Ultra Compact Schedule Grid */}
      <div className="px-3 py-4 print:px-2 print:py-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-2 print:gap-2">
            {scheduleData.map((day, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300"
              >
                {/* Ultra compact header */}
                <div className={`bg-gradient-to-r ${day.color} p-2 print:bg-gray-200 print:text-black`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white print:text-black">
                        {day.dayName}
                      </h3>
                      <p className="text-white/90 text-xs print:text-black">{day.date}</p>
                    </div>
                    <Clock className="w-3 h-3 text-white/80 print:text-black" />
                  </div>
                </div>

                {/* Ultra compact activities */}
                <div className="p-2 space-y-1">
                  {day.activities.map((activity, actIndex) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={actIndex}
                        className="flex items-center gap-1.5 p-1.5 rounded bg-gray-50 hover:bg-gray-100 print:hover:bg-gray-50 print:border-b print:border-gray-200 print:last:border-b-0"
                      >
                        <div className={`p-1 rounded text-xs ${getActivityTypeStyles(activity.type)} print:bg-gray-100 print:text-black`}>
                          <Icon className="w-2.5 h-2.5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="text-xs font-medium text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded print:bg-gray-100 print:text-black">
                              {activity.time}
                            </span>
                          </div>
                          <h4 className="font-medium text-xs text-gray-900 leading-tight print:text-black">
                            {activity.title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Minimal Footer */}
          <div className="mt-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 text-white print:bg-gray-100 print:text-black print:border print:border-gray-300">
            <Trophy className="w-5 h-5 mx-auto mb-1" />
            <h3 className="text-sm font-bold">Pregătește-te pentru o experiență de neuitat!</h3>
            <p className="text-xs opacity-90 print:opacity-100">
              Învață, practică și relaxează-te la malul Mării Negre 🌊
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootcampSchedule;