export function injectToastStyles() {
    if (document.getElementById("custom-toast-style")) return; // avoid duplicates
  
    const style = document.createElement("style");
    style.id = "custom-toast-style";
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 30px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
  
      .toast {
        background: rgba(0, 0, 0, 0.85);
        color: #fff;
        padding: 10px 16px;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        animation: fadein 0.3s, fadeout 0.3s ease-out 2.7s;
      }
  
      @keyframes fadein {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
  
      @keyframes fadeout {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
    `;
    document.head.appendChild(style);
  }

  



export function showToast(message, duration = 3000) {
    injectToastStyles();
  
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
  
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
  
    container.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
      if (container.childElementCount === 0) {
        container.remove();
      }
    }, duration);
  }
  