# How to Get EmailJS Keys

To send emails from your application, you need to set up an account with EmailJS. Follow these steps:

1.  **Sign Up**: Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up for a free account.

2.  **Add Email Service**:
    *   Go to the **Email Services** tab.
    *   Click **Add New Service**.
    *   Select **Gmail** (or your preferred provider).
    *   Click **Connect Account** and login.
    *   Click **Create Service**.
    *   **Copy the Service ID** (e.g., `service_xxxxx`). You will need this.

3.  **Create Email Template**:
    *   Go to the **Email Templates** tab.
    *   Click **Create New Template**.
    *   Design your email. You can use variables like `{{to_name}}`, `{{order_total}}`, and `{{message}}` which we are sending from the code.
    *   Click **Save**.
    *   **Copy the Template ID** (e.g., `template_xxxxx`). You will need this.

4.  **Get Public Key**:
    *   Go to the **Account** icon (top right) -> **Dashboard** or look for the **Integration** / **Account** tab depending on the UI version.
    *   Look for **API Keys**.
    *   **Copy the Public Key** (e.g., `user_xxxxx` or a long alphanumeric string).

## Where to put them in the code?

Open `src/pages/Payment.tsx` and replace the placeholders:

```javascript
const SERVICE_ID = 'YOUR_SERVICE_ID'   // Paste Service ID here
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID' // Paste Template ID here
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'   // Paste Public Key here
```
