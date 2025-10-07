// 'use client';

// import { useState } from 'react';
// import { FloatingWhatsApp } from '@carlos8a/react-whatsapp-floating-button';

// export function WhatsAppButton({ phoneNumber }) {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#FF3F1A] text-white p-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
//         isHovered ? 'pr-4' : ''
//       }`}
//       style={{ cursor: 'pointer' }}
//     >
//       <FloatingWhatsApp
//         phoneNumber={phoneNumber}
//         position="right"
//         autoOpenTimeout={5000}
//         autoOpen={false}
//         messageText="Hello! How can we help you?"
//         textReplyTime="Typically replies within an hour"
//         // Pass minimal styles to keep button size controlled
//         style={{ width: isHovered ? 'auto' : 48, height: 48 }}
//       />
//       {isHovered && (
//         <span className="text-sm whitespace-nowrap select-none pointer-events-none">
//           Chat with us
//         </span>
//       )}
//     </div>
//   );
// }

'use client';

import { FloatingWhatsApp } from '@carlos8a/react-whatsapp-floating-button';

export function WhatsAppButton({ phoneNumber }) {
  return (
    <FloatingWhatsApp
      phoneNumber={phoneNumber}
      position="right"
      autoOpenTimeout={5000}
      autoOpen={false}
      messageText="Hello! How can we help you?"
      textReplyTime="Typically replies within an hour"
    />
  );
}

