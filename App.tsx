import React, { useState } from 'react';
import { 
  Globe, 
  Copy, 
  Check, 
  Info, 
  ShieldCheck, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Key, 
  User, 
  Mail, 
  Lock, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Share2
} from 'lucide-react';

const translations = {
  en: {
    appTitle: "CIC Student Hub",
    badgeUtility: "Student Utility",
    heroTitle: "Get Your CIC Credentials",
    heroSubtitle: "Enter your information to generate your CIC login credentials according to the official format.",
    privacyNotice: "Your information is processed only in your browser and is not stored, saved, or transmitted.",
    labelName: "Full English Name",
    placeholderName: "Example: Ahmed Mohamed Mahmoud Ali",
    helperName: "Enter your full name exactly as shown on your university receipt.",
    labelId: "Student ID",
    placeholderId: "Example: 20261234",
    helperId: "Enter your student ID exactly as shown on your receipt.",
    btnSubmit: "Get Credentials",
    resultTitle: "Your Credentials",
    myCicHeader: "MY CIC ACCOUNT",
    emailHeader: "UNIVERSITY EMAIL",
    labelUsername: "Username",
    labelPassword: "Password",
    labelEmail: "Email Address",
    btnCopy: "Copy",
    btnCopied: "Copied!",
    btnCopyAll: "Copy All Credentials",
    btnCopyAllDone: "All Credentials Copied!",
    showPassword: "Show",
    hidePassword: "Hide",
    disclaimer: "Unofficial Student Utility — Credentials calculated based on standard university formatting rules. Always verify with official CIC channels if you experience login issues.",
    footerTitle: "CIC Student Hub",
    footerSubtitle: "Unofficial student utility tool Made with ❤️ by a Zyad .Mo .",
    footerPrivacy: "Your information stays in your browser state and disappears upon page refresh.",
    errNameRequired: "Please enter your full English name.",
    errNameMinWords: "Name must contain at least 2 words.",
    errNameEnglishOnly: "Please use English letters only.",
    errIdRequired: "Please enter your Student ID.",
    errIdDigitsOnly: "Student ID must contain digits only.",
    errIdMinLength: "Student ID must be at least 3 digits."
  },
  ar: {
    appTitle: "مركز طلاب CIC",
    badgeUtility: "أداة طلابية",
    heroTitle: "احصل على بيانات الدخول الخاصة بك",
    heroSubtitle: "أدخل بياناتك لحساب وصياغة بيانات الدخول الخاصة بك في CIC طبقاً للصيغة المعتمدة.",
    privacyNotice: "تتم معالجة معلوماتك داخل متصفحك فقط ولا يتم حفظها، تخزينها، أو إرسالها لأي مكان.",
    labelName: "الاسم الإنجليزي بالكامل",
    placeholderName: "مثال: Ahmed Mohamed Mahmoud Ali",
    helperName: "أدخل اسمك بالكامل كما هو مدون في إيصال الجامعة.",
    labelId: "الرقم الجامعي",
    placeholderId: "مثال: 20261234",
    helperId: "أدخل رقمك الجامعي كما هو مدون في إيصال الجامعة.",
    btnSubmit: "احصل على بيانات الدخول",
    resultTitle: "بيانات الدخول الخاصة بك",
    myCicHeader: "حساب MY CIC",
    emailHeader: "البريد الجامعي",
    labelUsername: "اسم المستخدم",
    labelPassword: "كلمة المرور",
    labelEmail: "البريد الإلكتروني",
    btnCopy: "نسخ",
    btnCopied: "تم النسخ!",
    btnCopyAll: "نسخ جميع البيانات",
    btnCopyAllDone: "تم نسخ جميع البيانات!",
    showPassword: "إظهار",
    hidePassword: "إخفاء",
    disclaimer: "أداة طلابية غير رسمية — تتم صياغة البيانات بناءً على القواعد المعتمدة بالجامعة. يرجى التأكد دائماً مع الجهات الرسمية في CIC في حال مواجهة أي مشكلة.",
    footerTitle: "مركز طلاب CIC",
    footerSubtitle: "أداة مساعدة غير رسمية للطلاب، صُنعت بكل حب ❤️ بواسطة Zyad .Mo.",
    footerPrivacy: "تبقى معلوماتك داخل متصفحك وتختفي تماماً بمجرد إعادة تحميل الصفحة.",
    errNameRequired: "يرجى إدخال الاسم باللغة الإنجليزية بالكامل.",
    errNameMinWords: "يجب أن يتكون الاسم من كلمتين على الأقل.",
    errNameEnglishOnly: "يرجى استخدام الحروف الإنجليزية فقط.",
    errIdRequired: "يرجى إدخال الرقم الجامعي.",
    errIdDigitsOnly: "يجب أن يحتوي الرقم الجامعي على أرقام فقط.",
    errIdMinLength: "يجب أن يتكون الرقم الجامعي من 3 أرقام على الأقل."
  }
};

// Core credential format formula
const generateCredentials = (fullName, studentId) => {
  const cleanName = fullName.trim().replace(/\s+/g, ' ');
  const words = cleanName.split(' ');
  
  const firstName = words[0].toLowerCase();
  const lastName = words[words.length - 1];
  const lastNameInitial = lastName.charAt(0).toLowerCase();
  
  const idDigits = studentId.trim();
  const idSuffix = idDigits.slice(2);
  
  const username = `${firstName}_${lastNameInitial}${idSuffix}`;
  const password = idDigits;
  const email = `${username}@cic-cairo.edu.eg`;
  
  return { username, password, email };
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [errors, setErrors] = useState({ fullName: '', studentId: '' });
  const [result, setResult] = useState(null);
  
  // UI state for password visibility and copy feedback
  const [showCicPassword, setShowCicPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null); // 'username' | 'cic-pass' | 'email' | 'email-pass' | 'all'

  const t = translations[lang];
  const isRtl = lang === 'ar';

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: '', studentId: '' };

    // Full Name Validation
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = t.errNameRequired;
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      newErrors.fullName = t.errNameEnglishOnly;
      isValid = false;
    } else if (trimmedName.split(/\s+/).length < 2) {
      newErrors.fullName = t.errNameMinWords;
      isValid = false;
    }

    // Student ID Validation
    const trimmedId = studentId.trim();
    if (!trimmedId) {
      newErrors.studentId = t.errIdRequired;
      isValid = false;
    } else if (!/^\d+$/.test(trimmedId)) {
      newErrors.studentId = t.errIdDigitsOnly;
      isValid = false;
    } else if (trimmedId.length < 3) {
      newErrors.studentId = t.errIdMinLength;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const creds = generateCredentials(fullName, studentId);
      setResult(creds);
    } else {
      setResult(null);
    }
  };

  const handleCopy = (text, key) => {
    if (!navigator.clipboard) return;
    
    let textToCopy = text;
    if (key === 'all' && result) {
      textToCopy = 
`--- MY CIC ---
Username: ${result.username}
Password: ${result.password}

--- UNIVERSITY EMAIL ---
Email: ${result.email}
Password: ${result.password}`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div 
      className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-all duration-200 selection:bg-red-100 selection:text-red-800 ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#C8102E] text-white p-2 rounded-xl shadow-xs">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
                {t.appTitle}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C8102E] bg-red-50 border border-red-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                {t.badgeUtility}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setLang(lang === 'en' ? 'ar' : 'en');
              setErrors({ fullName: '', studentId: '' });
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Toggle language"
          >
            <Globe size={15} />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>
      </header>

      {}
      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          
          {/* HERO BANNER */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl p-3 text-xs sm:text-sm text-left max-w-xl mt-2">
              <ShieldCheck size={18} className="shrink-0 text-emerald-600" />
              <span>{t.privacyNotice}</span>
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-bold text-slate-800">
                  {t.labelName}
                </label>
                <div className="relative">
                  <div className={`absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`}>
                    <User size={18} />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    dir="ltr"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder={t.placeholderName}
                    className={`w-full py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-slate-900 bg-slate-50 border ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-[#C8102E]'
                    } rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                    aria-invalid={!!errors.fullName}
                  />
                </div>
                {errors.fullName ? (
                  <p className="text-red-600 text-xs font-medium mt-1" aria-live="polite">{errors.fullName}</p>
                ) : (
                  <p className="text-slate-500 text-xs">{t.helperName}</p>
                )}
              </div>

              {/* Student ID Field */}
              <div className="space-y-2">
                <label htmlFor="studentId" className="block text-sm font-bold text-slate-800">
                  {t.labelId}
                </label>
                <div className="relative">
                  <div className={`absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`}>
                    <Lock size={18} />
                  </div>
                  <input
                    id="studentId"
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    value={studentId}
                    onChange={(e) => {
                      setStudentId(e.target.value);
                      if (errors.studentId) setErrors({ ...errors, studentId: '' });
                    }}
                    placeholder={t.placeholderId}
                    className={`w-full py-3 ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'} text-sm text-slate-900 bg-slate-50 border ${
                      errors.studentId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-[#C8102E]'
                    } rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all`}
                    aria-invalid={!!errors.studentId}
                  />
                </div>
                {errors.studentId ? (
                  <p className="text-red-600 text-xs font-medium mt-1" aria-live="polite">{errors.studentId}</p>
                ) : (
                  <p className="text-slate-500 text-xs">{t.helperId}</p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-[#C8102E] hover:bg-red-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
              >
                <Sparkles size={18} />
                <span>{t.btnSubmit}</span>
                {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          {}
          {result && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-slate-900">{t.resultTitle}</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check size={12} /> Generated
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden divide-y divide-slate-100">
                
                {/* 1. MY CIC CARD */}
                <div className="p-5 sm:p-6 space-y-4 bg-white">
                  <div className="flex items-center gap-2 text-[#C8102E]">
                    <Key size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">{t.myCicHeader}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Username */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">{t.labelUsername}</span>
                        <span className="font-mono font-semibold text-slate-900 text-base break-all" dir="ltr">
                          {result.username}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.username, 'username')}
                        className={`self-start text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          copiedKey === 'username' 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {copiedKey === 'username' ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === 'username' ? t.btnCopied : t.btnCopy}</span>
                      </button>
                    </div>

                    {/* Password */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase block">{t.labelPassword}</span>
                          <button
                            type="button"
                            onClick={() => setShowCicPassword(!showCicPassword)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                          >
                            {showCicPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                            <span>{showCicPassword ? t.hidePassword : t.showPassword}</span>
                          </button>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 text-base tracking-widest block" dir="ltr">
                          {showCicPassword ? result.password : '••••••••'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.password, 'cic-pass')}
                        className={`self-start text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          copiedKey === 'cic-pass' 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {copiedKey === 'cic-pass' ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === 'cic-pass' ? t.btnCopied : t.btnCopy}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. UNIVERSITY EMAIL CARD */}
                <div className="p-5 sm:p-6 space-y-4 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-[#C8102E]">
                    <Mail size={18} />
                    <h3 className="font-bold text-xs uppercase tracking-wider">{t.emailHeader}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">{t.labelEmail}</span>
                        <span className="font-mono font-semibold text-slate-900 text-sm sm:text-base break-all" dir="ltr">
                          {result.email}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.email, 'email')}
                        className={`self-start text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          copiedKey === 'email' 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {copiedKey === 'email' ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === 'email' ? t.btnCopied : t.btnCopy}</span>
                      </button>
                    </div>

                    {/* Email Password */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between gap-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase block">{t.labelPassword}</span>
                          <button
                            type="button"
                            onClick={() => setShowEmailPassword(!showEmailPassword)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                          >
                            {showEmailPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                            <span>{showEmailPassword ? t.hidePassword : t.showPassword}</span>
                          </button>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 text-base tracking-widest block" dir="ltr">
                          {showEmailPassword ? result.password : '••••••••'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.password, 'email-pass')}
                        className={`self-start text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                          copiedKey === 'email-pass' 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {copiedKey === 'email-pass' ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedKey === 'email-pass' ? t.btnCopied : t.btnCopy}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* COPY ALL BUTTON & DISCLAIMER */}
                <div className="p-5 bg-slate-100/70 space-y-4">
                  <button
                    onClick={() => handleCopy('', 'all')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all shadow-2xs ${
                      copiedKey === 'all'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {copiedKey === 'all' ? <Check size={16} /> : <Share2 size={16} />}
                    <span>{copiedKey === 'all' ? t.btnCopyAllDone : t.btnCopyAll}</span>
                  </button>

                  <div className="flex items-start gap-2 text-xs text-slate-600 bg-white/80 p-3 rounded-lg border border-slate-200">
                    <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{t.disclaimer}</p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-1.5">
          <p className="font-extrabold text-slate-800 text-sm">{t.footerTitle}</p>
          <p className="text-xs text-slate-500">{t.footerSubtitle}</p>
          <p className="text-[11px] text-slate-400">{t.footerPrivacy}</p>
        </div>
      </footer>
    </div>
  );
}