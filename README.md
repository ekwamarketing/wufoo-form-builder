# EKWA Wufoo Form Builder

**Version:** 1.2.2
**Author:** Sameera Kanchana
**License:** GPL v2 or later
**Requires:** WordPress with Gutenberg block editor

The EKWA Wufoo Form Builder is a comprehensive WordPress plugin that allows users to create custom forms using a block-based Gutenberg interface. It integrates with Wufoo's form submission service and includes a full suite of field blocks, icon support, client-side validation, anti-spam protection, phone masking, and a Flatpickr-powered date picker.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Plugin Settings](#plugin-settings)
- [Main Form Block](#main-form-block)
- [Form Field Blocks](#form-field-blocks)
- [Icon System](#icon-system)
- [Validation](#validation)
- [Anti-Spam Protection](#anti-spam-protection)
- [Wufoo Integration](#wufoo-integration)
- [Form Templates](#form-templates)
- [Layout Blocks](#layout-blocks)
- [Styling & Appearance](#styling--appearance)
- [Phone Number Masking](#phone-number-masking)
- [Date Picker](#date-picker)
- [Auto Updates](#auto-updates)
- [Browser Compatibility](#browser-compatibility)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Block-based form creation using the WordPress Gutenberg editor
- Wufoo integration for form submission handling via EKWA handler
- AES-256-CBC encryption of the Wufoo form action URL and reCAPTCHA secret key before transmission
- Real-time client-side validation with custom error messages per field
- Honeypot anti-spam field automatically included in every form
- Google reCAPTCHA v2 ("I'm not a robot" checkbox) support
- Icon support via Iconify — thousands of SVG icons with position controls
- Multiple form templates: Contact Form, Appointment Form, Blank Form
- Responsive, mobile-friendly design
- Submit button style, color, and alignment customization
- Phone number masking for telephone inputs (multiple formats)
- Flatpickr-powered date picker with weekend/past/future date restrictions
- Textarea minimum character validation
- Conditional asset loading — CSS and JS only load on pages with a form block
- Auto-updates via GitHub using the Plugin Update Checker library

---

## Installation

1. Download or clone the plugin into `/wp-content/plugins/ekwa-wufoo-form-builder/`.
2. Activate it from **WordPress Admin → Plugins**.
3. The **Ekwa Wufoo Form Builder** block will appear in the **Widgets** category of the block editor.
4. Go to **Settings → Wufoo Form Builder** to configure reCAPTCHA keys and asset loading behavior.

---

## Plugin Settings

Navigate to **WordPress Admin → Settings → Wufoo Form Builder** to access these options:

### Performance Settings

| Setting | Description |
|---|---|
| **Conditional Assets Loading** | When enabled (default), CSS and JS files only load on pages that contain a Wufoo form block. Disable to load assets site-wide for maximum compatibility. |

### Google reCAPTCHA Settings

| Setting | Description |
|---|---|
| **reCAPTCHA Site Key** | Your Google reCAPTCHA v2 public (site) key. |
| **reCAPTCHA Secret Key** | Your Google reCAPTCHA v2 private (secret) key. Stored securely and never exposed publicly — it is AES-256-CBC encrypted before being sent to the EKWA handler. |

Get your reCAPTCHA keys at: https://www.google.com/recaptcha/admin

---

## Main Form Block

Block name: `ekwa-wufoo/form-builder`

Add this block to a page to create a form. All field blocks must be placed inside it.

### Settings (Inspector Controls)

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Form ID** | string | (auto) | Unique HTML ID for the form element (e.g., `contact-form-1`). |
| **Submit Button Text** | string | `Submit` | Label on the submit button. |
| **Ekwa URL** | string | `https://www.ekwa.com/ekwa-wufoo-handler/en-no-recaptcha.php` | Handler endpoint. Automatically switches to the reCAPTCHA endpoint when reCAPTCHA is enabled. |
| **Form Action URL** | string | — | Wufoo form action URL. This is AES-256-CBC encrypted before being sent as a hidden field. |
| **ID Stamp** | string | — | Wufoo-provided `idstamp` value. Sent as a hidden field. |
| **Submit Button Style** | string | `default` | One of: `default`, `rounded`, `square`, `outline`. |
| **Submit Button Color** | color | `#007cba` | Background color of the submit button. |
| **Submit Button Text Color** | color | `#ffffff` | Text color of the submit button. |
| **Submit Button Alignment** | string | `left` | One of: `left`, `center`, `right`. |
| **Enable Google reCAPTCHA** | boolean | `false` | When enabled, displays the reCAPTCHA checkbox and uses the reCAPTCHA handler endpoint. Requires site/secret keys in plugin settings. |

---

## Form Field Blocks

### 1. Form Input — `ekwa-wufoo/form-input`

A single-line input field.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Input Label` | Field label text. |
| **Field ID** | string | — | Maps to Wufoo field (e.g., `Field1`). Used as both `id` and `name`. |
| **Placeholder** | string | `Enter text...` | Placeholder text inside the input. |
| **Input Type** | string | `text` | One of: `text`, `email`, `password`, `number`, `tel`, `url`. |
| **Required Field** | boolean | `false` | Marks the field as required. Shows a red `*` indicator. |
| **Validation Message** | string | — | Message shown when validation fails. |
| **Enable Phone Masking** | boolean | `true` | Auto-enabled when input type is `tel`. Formats number as user types. |
| **Phone Format** | string | `###-###-####` | Format pattern for phone masking. Options: `###-###-####`, `(###) ###-####`, `###.###.####`, `### ### ####`. |
| **Icon** | string | — | Iconify icon name (e.g., `mdi:phone`). SVG is fetched and stored. |
| **Icon Position** | string | `left` | One of: `left`, `right`, `above`. |

---

### 2. Form Select — `ekwa-wufoo/form-select`

A dropdown select field.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Select Label` | Field label text. |
| **Field ID** | string | — | Maps to Wufoo field (e.g., `Field4`). |
| **Options** | string | `Option 1,Option 2,Option 3` | Comma-separated list of dropdown options. |
| **Required Field** | boolean | `false` | Makes selection required. |
| **Validation Message** | string | — | Message shown when nothing is selected and form is submitted. |
| **Icon** | string | — | Iconify icon name. |
| **Icon Position** | string | `left` | One of: `left`, `right`, `above`. |

---

### 3. Form Radio Group — `ekwa-wufoo/form-radio`

A group of radio buttons.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Radio Group Label` | Legend text for the radio group. |
| **Field Name** | string | — | Wufoo field group name (e.g., `Field6`). All radios share this `name`. |
| **Options** | string | `Option 1,Option 2,Option 3` | Comma-separated list of radio options. |
| **Option IDs** | string | — | Comma-separated individual Wufoo field IDs for each option (e.g., `Field6_1,Field6_2,Field6_3`). |
| **Default Selected** | string | — | Pre-selected option value. |
| **Required Field** | boolean | `false` | Requires a selection before submit. |
| **Validation Message** | string | — | Error message shown when no option is selected. |

---

### 4. Form Checkbox — `ekwa-wufoo/form-checkbox`

A single standalone checkbox.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Checkbox Label` | Label shown next to the checkbox. |
| **Field ID** | string | — | Maps to Wufoo field. |
| **Value** | string | `checkbox_value` | Value submitted when checked. |
| **Checked by Default** | boolean | `false` | Pre-checks the checkbox. |
| **Required Field** | boolean | `false` | Requires the checkbox to be checked. |
| **Validation Message** | string | — | Error message when not checked on submit. |

---

### 5. Form Checkbox Group — `ekwa-wufoo/form-checkbox-group`

A group of checkboxes with min/max selection enforcement.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Checkbox Group Label` | Group legend. Leave empty to hide the fieldset border. |
| **Field Name** | string | — | Wufoo group name used as `data-group` for validation. |
| **Options** | string | `Option 1,Option 2,Option 3` | Comma-separated checkbox labels. |
| **Option IDs** | string | — | Comma-separated individual Wufoo field IDs (one per checkbox, e.g., `Field7,Field8,Field9`). |
| **Required** | boolean | `false` | Enables min/max selection validation. |
| **Validation Message** | string | — | Error message shown when selection constraints are violated. |
| **Min Selections** | number | `1` | Minimum number of checkboxes that must be checked. |
| **Max Selections** | number | `0` | Maximum allowed selections (`0` = no limit). |

---

### 6. Form Textarea — `ekwa-wufoo/form-textarea`

A multi-line text input, typically used for comments or messages.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Textarea Label` | Field label. |
| **Field ID** | string | — | Maps to Wufoo field (e.g., `Field9`). |
| **Placeholder** | string | `Enter your message...` | Placeholder text. |
| **Rows** | number | `4` | Visible height of the textarea (2–20). |
| **Minimum Characters** | number | `0` | Minimum character count required. Set to `0` to disable. Enforced via `minlength` and JS validation. |
| **Required Field** | boolean | `false` | Makes the field required. |
| **Validation Message** | string | — | Error message when field is empty or below minimum character count. |
| **Icon** | string | — | Iconify icon name. |
| **Icon Position** | string | `above` | One of: `above`, `top-left`, `top-right`. |

---

### 7. Form Datepicker — `ekwa-wufoo/form-datepicker`

A text input enhanced with the Flatpickr date picker library.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Label** | string | `Select Date` | Field label. |
| **Field ID** | string | — | Maps to Wufoo field (e.g., `Field10`). |
| **Placeholder** | string | `Select a date` | Shown before a date is selected. |
| **Required Field** | boolean | `false` | Makes the field required. |
| **Validation Message** | string | — | Error message when no date is selected. |
| **Disable Past Dates** | boolean | `true` | Prevents selection of dates before today. Sets `min` date to today. |
| **Disable Future Dates** | boolean | `false` | Prevents selection of dates after today. Mutually exclusive with Disable Past Dates. |
| **Disable Weekends** | boolean | `false` | Greys out and disables Saturday and Sunday. |
| **Min Date** | string | — | Explicit minimum selectable date (YYYY-MM-DD). Overrides Disable Past Dates. |
| **Max Date** | string | — | Explicit maximum selectable date (YYYY-MM-DD). Overrides Disable Future Dates. |
| **Default Value** | string | — | Pre-selected date value. |
| **Icon** | string | — | Iconify icon name. |
| **Icon Position** | string | `left` | One of: `left`, `right`, `above`. |

---

### 8. Form Privacy Checkbox — `ekwa-wufoo/form-privacy-checkbox`

A dedicated privacy policy acceptance checkbox with a configurable link.

| Attribute | Type | Default | Description |
|---|---|---|---|
| **Field ID** | string | — | Maps to Wufoo field. |
| **Privacy Text** | string | `By submitting the above form you agree and accept our Privacy Policy.*` | Full text shown next to the checkbox. Include the link text in this string. |
| **Privacy URL** | string | — | URL of the privacy policy page. |
| **Link Text** | string | `Privacy Policy` | The portion of Privacy Text that becomes a hyperlink. |
| **Opens in New Tab** | boolean | `true` | Opens the privacy policy link in a new browser tab with `rel="noopener noreferrer"`. |
| **Value** | string | `I Agree` | Value submitted when the checkbox is checked. |
| **Required** | boolean | `true` | Must be checked before the form can be submitted. |
| **Validation Message** | string | `You must accept the privacy policy to continue.` | Error message shown when not checked. |

---

## Icon System

All field blocks (except checkbox group and radio group) support Iconify icons.

### Adding an Icon
1. Select a field block in the editor.
2. In the right-hand **Inspector Controls**, open the **Icon Settings** panel.
3. Click **Add Icon** (or **Change Icon** if one is already set).
4. Search for an icon by name (e.g., `mdi:phone`, `lucide:mail`).
5. Click an icon to select it — the SVG is fetched from the Iconify API and stored in the block attributes so it renders without external requests on the frontend.
6. Choose the **Icon Position**.
7. Click **Remove** to clear the icon.

### Icon Positions by Block Type

| Block | Available Positions |
|---|---|
| Form Input | `left`, `right`, `above` |
| Form Select | `left`, `right`, `above` |
| Form Textarea | `above`, `top-left`, `top-right` |
| Form Datepicker | `left`, `right`, `above` |

- **left / right**: Icon appears inside the input/select field.
- **above**: Icon appears inline before the field label text.
- **top-left / top-right**: Icon is absolutely positioned inside the top corner of the textarea.

---

## Validation

All validation runs client-side using `assets/js/form-validation.js`.

### How It Works
- Validation triggers on field blur (when user leaves a field) and on form submit.
- If any field fails validation, the form does not submit and the relevant error message is displayed below the field in red.
- Error indicators are cleared as soon as the user starts correcting the field.

### Validation Types

| Type | Trigger | Notes |
|---|---|---|
| Required | Empty field on submit/blur | Applies to all field types. |
| Email format | Blur / submit on `type="email"` | Validates standard email format. |
| Phone format | Blur / submit on `type="tel"` with masking | Validates against the chosen mask pattern. |
| Textarea min characters | Blur / submit when `minCharacters > 0` | Uses `data-min-characters` attribute. |
| Checkbox required | Submit | Validates single checkboxes and privacy checkbox. |
| Checkbox group min/max | Submit | Uses `data-min-selections` and `data-max-selections` attributes. |
| Radio required | Submit | Validates that at least one radio is selected. |
| Date required | Submit | Validates the Flatpickr input is not empty. |
| reCAPTCHA | Submit | Blocks submission if reCAPTCHA is not completed. |

### Setting Custom Validation Messages
1. Select any field block in the editor.
2. In Inspector Controls, toggle **Required Field** on.
3. Enter your custom text in **Validation Message**.
4. For Textarea, also set **Minimum Characters** and optionally a separate message for too-short input.

---

## Anti-Spam Protection

### Honeypot Field
Every form automatically includes a hidden honeypot field (`name="website_url"`). It is:
- Positioned off-screen via CSS (`left: -9999px`).
- Given `tabindex="-1"` and `autocomplete="off"` so real users never fill it.
- If a bot fills it, the EKWA handler rejects the submission server-side.

No configuration is needed — it is always active.

### Google reCAPTCHA v2
When enabled per-form (toggle in the main form block) and configured globally (plugin settings):
- The "I'm not a robot" checkbox widget is rendered above the submit button.
- The reCAPTCHA secret key is AES-256-CBC encrypted before being sent to the handler.
- The JS validation prevents form submission if reCAPTCHA is not completed.
- The handler endpoint automatically switches to `en-with-recaptcha.php`.

**Setup:**
1. Go to **Settings → Wufoo Form Builder**.
2. Enter your reCAPTCHA **Site Key** and **Secret Key**.
3. In any form block, toggle **Enable Google reCAPTCHA** on.

---

## Wufoo Integration

### Step 1: Create a Wufoo Form
1. Log in to your Wufoo account.
2. Create a new form with fields matching what you plan to build in WordPress.
3. From the **Code Manager**, note the **Form Action URL** and the **ID Stamp** (`idstamp`) value.

### Step 2: Configure the Main Form Block
Select the **Ekwa Wufoo Form Builder** block and fill in:

- **Form ID** — a unique slug for this form (e.g., `contact-form-1`).
- **Form Action URL** — the Wufoo action URL (will be AES-256-CBC encrypted before submission).
- **ID Stamp** — the Wufoo `idstamp` value (sent as a hidden field).
- **Ekwa URL** — leave as default unless directed otherwise.

### Step 3: Match Field IDs to Wufoo Fields
Each field block has a **Field ID** setting. Set it to the corresponding Wufoo field name:

| Block Type | Field ID Format | Example |
|---|---|---|
| Input | Single field | `Field1` |
| Email | Single field | `Field2` |
| Phone (tel) | Single field | `Field3` |
| Select | Single field | `Field4` |
| Textarea | Single field | `Field9` |
| Datepicker | Single field | `Field10` |
| Radio group | Group field name | `Field6` |
| Radio options | Individual IDs | `Field6_1`, `Field6_2`, `Field6_3` |
| Checkbox group | Individual IDs | `Field7`, `Field8`, `Field9` |
| Privacy checkbox | Single field | `Field11` |

### How Submission Works
1. User fills in the form and clicks Submit.
2. Client-side validation runs. If any field fails, submission is blocked.
3. If reCAPTCHA is enabled, it is verified before submission.
4. The honeypot field is checked server-side by the EKWA handler.
5. The encrypted Wufoo action URL and reCAPTCHA secret are decrypted by the handler.
6. The handler forwards the data to Wufoo.

---

## Form Templates

When you add the **Ekwa Wufoo Form Builder** block, you are prompted to choose a template:

### Contact Form
Pre-built with:
- Name (text input, user icon)
- Email (email input, mail icon)
- Phone (tel input, phone icon, phone masking)
- Comments (textarea, comment icon)
- Privacy checkbox with privacy policy link

### Appointment Form
Pre-built with:
- Two-column layout (date + time)
- Date picker (calendar icon, past dates disabled)
- Time selection dropdown
- New patient radio group
- Name, email, phone fields
- Comments textarea
- Privacy checkbox

### Blank Form
An empty form — build from scratch by adding any field blocks.

---

## Layout Blocks

Inside the form builder you can nest standard WordPress core blocks for layout:

| Block | Use Case |
|---|---|
| `core/columns` | Side-by-side fields (e.g., date and time) |
| `core/column` | Individual column inside a columns block |
| `core/group` | Group a set of related fields |
| `core/heading` | Section headings within the form |
| `core/paragraph` | Instructional or descriptive text |
| `core/spacer` | Vertical spacing between fields |
| `core/separator` | Horizontal rule / visual divider |

---

## Styling & Appearance

### Submit Button Styles
Set via **Submit Button Style** on the main form block:

| Style | Appearance |
|---|---|
| `default` | Standard rectangular button |
| `rounded` | Button with rounded corners |
| `square` | Button with sharp square corners |
| `outline` | Transparent background, colored border matching the button color |

### Color & Alignment
- **Submit Button Color** — background color (default `#007cba`).
- **Submit Button Text Color** — button label color (default `#ffffff`).
- **Submit Button Alignment** — `left`, `center`, or `right`.

For outline style, the border color automatically matches the button background color.

---

## Phone Number Masking

Handled by `assets/js/phone-mask.js`.

When an input field is set to type `tel` and **Enable Phone Masking** is on, the input formats the number in real time as the user types.

### Available Formats

| Display Example | Format Pattern |
|---|---|
| `111-111-1111` | `###-###-####` |
| `(111) 111-1111` | `(###) ###-####` |
| `111.111.1111` | `###.###.####` |
| `111 111 1111` | `### ### ####` |

The placeholder is automatically set to the format pattern with `#` replaced by `_` (e.g., `___-___-____`).

---

## Date Picker

Powered by [Flatpickr](https://flatpickr.js.org/) via `assets/js/flatpickr-datepicker.js`. The date input is read-only and the calendar opens on click.

### Restriction Options
- **Disable Past Dates** — prevents selecting any date before today (sets `min` to today).
- **Disable Future Dates** — prevents selecting any date after today (sets `max` to today). Mutually exclusive with Disable Past Dates.
- **Disable Weekends** — Saturdays and Sundays are greyed out and unselectable.
- **Min Date / Max Date** — explicit date bounds in `YYYY-MM-DD` format.
- **Default Value** — pre-selected date shown when the form loads.

---

## Auto Updates

The plugin uses the [Plugin Update Checker](https://github.com/YahnisElsts/plugin-update-checker) library (v5) to automatically check for updates from the GitHub repository:

```
https://github.com/ekwamarketing/wufoo-form-builder/
```

When a new release is published on GitHub, WordPress will show an update notification in the admin dashboard just like any other plugin.

---

## Browser Compatibility

- All modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support
- Mobile-responsive layout
- Touch-friendly Flatpickr date picker
- Icons rendered as inline SVG — no external requests on the frontend

---

## FAQ

**Q: Why is the form not submitting?**
A: Check the browser console for JavaScript errors. Ensure all required Field IDs match your Wufoo form fields exactly. If reCAPTCHA is enabled, make sure the site key is configured in plugin settings.

**Q: How do I stop assets loading on every page?**
A: Go to **Settings → Wufoo Form Builder** and make sure **Conditional Assets Loading** is enabled (it is by default). Assets will only load on pages containing a form block.

**Q: Can I use the form without a Wufoo account?**
A: No. The plugin is designed specifically to submit data to Wufoo via the EKWA handler. The Form Action URL and ID Stamp from your Wufoo account are required for submissions to work.

**Q: My icons are not showing up on the frontend.**
A: Icons are stored as SVG content in the block attributes at the time you select them. If SVG content is missing, go back to the block in the editor, remove the icon, and re-add it. This re-fetches the SVG from the Iconify API and stores it.

**Q: Phone masking is not working.**
A: Ensure the input type is set to `tel` and **Enable Phone Masking** is toggled on in the block settings. The `ekwa-phone-mask` class must be present on the input element.

**Q: The date picker is not appearing.**
A: Check that Flatpickr assets are loading — look for `ekwa-flatpickr-datepicker` in the page source. If Conditional Assets Loading is on, it only loads on pages with a form block. Try disabling conditional loading temporarily to test.

**Q: How do I set up reCAPTCHA?**
A: Register your site at https://www.google.com/recaptcha/admin to get a v2 site key and secret key. Add both to **Settings → Wufoo Form Builder**. Then enable **Google reCAPTCHA** on the specific form block(s) where you want it.

**Q: Can I push to two GitHub accounts from the same repo?**
A: Yes. Add a second remote: `git remote add ekwa https://github.com/ekwamarketing/wufoo-form-builder`. Then use `git push origin main` for `agskanchana` and `git push ekwa main` for `ekwamarketing`. If you have credential conflicts, clear the stored credentials from Windows Credential Manager (`cmdkey /delete:LegacyGeneric:target=git:https://github.com`) and re-authenticate on the next push.

**Q: The privacy policy link is not opening in a new tab.**
A: The plugin automatically applies `target="_blank" rel="noopener noreferrer"` to privacy links when **Opens in New Tab** is enabled. If it still doesn't open in a new tab, clear your page cache and check that the privacy URL is correctly set in the block settings.

**Q: What happens if a bot submits the form?**
A: The honeypot field (`website_url`) is hidden from real users. If a bot fills it, the EKWA handler detects it and rejects the submission without forwarding it to Wufoo. If reCAPTCHA is also enabled, an additional layer of verification is required.

**Q: Can I customize the validation error color?**
A: The error color (`#d94f4f`) is currently set inline by the PHP render callbacks. To change it, you would need to modify the render functions in `ekwa-wufoo-form-builder.php` or override the styles with custom CSS.

**Q: How do I update the plugin?**
A: The plugin uses the Plugin Update Checker library. When a new version is released on GitHub (`ekwamarketing/wufoo-form-builder`), WordPress will display an update notification in the admin dashboard automatically. Click **Update Now** as with any plugin.

---

## Contributing

Pull requests and issues are welcome on GitHub:
- `agskanchana/wufoo-form-builder`
- `ekwamarketing/wufoo-form-builder`

---

## License

Licensed under the GPL v2 or later.
