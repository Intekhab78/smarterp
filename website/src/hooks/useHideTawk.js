// import { useEffect } from "react";

// export default function useHideTawk() {
//     useEffect(() => {
//         const hideChat = () => {
//             if (window.Tawk_API && window.Tawk_API.hideWidget) {
//                 window.Tawk_API.hideWidget();
//             }
//         };

//         // 🔥 Wait until Tawk loads
//         const interval = setInterval(() => {
//             if (window.Tawk_API && window.Tawk_API.hideWidget) {
//                 hideChat();
//                 clearInterval(interval);
//             }
//         }, 300);

//         return () => {
//             if (window.Tawk_API && window.Tawk_API.showWidget) {
//                 window.Tawk_API.showWidget();
//             }
//         };
//     }, []);
// }


import { useEffect } from "react";

export default function useHideTawk(shouldHide) {
    useEffect(() => {
        const hideChat = () => {
            if (window.Tawk_API && window.Tawk_API.hideWidget) {
                window.Tawk_API.hideWidget();
            }
        };

        if (shouldHide) {
            const interval = setInterval(() => {
                if (window.Tawk_API && window.Tawk_API.hideWidget) {
                    hideChat();
                    clearInterval(interval);
                }
            }, 300);

            return () => clearInterval(interval);
        } else {
            if (window.Tawk_API && window.Tawk_API.showWidget) {
                window.Tawk_API.showWidget();
            }
        }
    }, [shouldHide]);
}