# Netflix Admin Panel Guide

## Overview

The Netflix Admin Panel allows you to dynamically manage Netflix subscription content on your website without touching code. All changes are stored locally in your browser and reflected immediately on the Netflix in Nepal page.

## Access Admin Panel

Visit: `/admin` to access the main admin dashboard
Visit: `/admin/netflix` to manage Netflix subscription plans and content

## Features

### 1. Hero Section Management

**Title**: Edit the main page title
**Description**: Customize the page description with Netflix subscription keywords

### 2. Netflix Subscription Plans

Edit each Netflix subscription plan:
- **Plan Name**: Mobile, Basic, Standard, Premium
- **Price**: e.g., Rs. 350, Rs. 499
- **Duration**: e.g., 1 Month, 3 Months
- **Description**: Add descriptive text mentioning "Netflix subscription"
- **Buy Link**: Link to product page or category
- **Mark as Best Value**: Highlight this plan with a special badge
- **Features**: Add, edit, or remove features for each Netflix subscription plan

### 3. Action Buttons

Manage buttons that appear on the Netflix page:
- **Button Label**: Text displayed on the button
- **Link/URL**: Where the button links to
- **Variant**: Primary (amber) or Secondary (outlined)

### 4. SEO Keywords

View and manage keywords automatically included in page metadata for search engine optimization. Keywords include:
- Netflix subscription Nepal 2026
- Netflix subscription in Nepal
- Netflix subscription price Nepal
- And 25+ more variations

## How to Use

### Editing Netflix Plans

1. Scroll to the "Netflix Subscription Plans" section
2. Find the plan you want to edit (Mobile, Basic, Standard, Premium)
3. Update the details:
   - Change price from Rs. 350 to a new amount
   - Add or remove features
   - Update description with Netflix subscription keywords
   - Change the buy link to point to a different product

4. Click "Save All Changes" button

### Adding Features

1. Navigate to a Netflix plan
2. Click "Add Feature" button
3. Enter the feature description (include "Netflix subscription" keywords)
4. Save changes

### Removing Features

1. Find the feature in the Netflix plan
2. Click the trash/delete button
3. Save changes

### Updating Action Buttons

1. Scroll to "Action Buttons" section
2. Edit the button label, link, or variant
3. Primary buttons use amber color (best for CTAs)
4. Secondary buttons have outlined style
5. Save changes

## SEO Best Practices

When editing content, include these keywords naturally:

- Netflix subscription Nepal
- Netflix subscription in Nepal
- Netflix subscription price
- Netflix subscription plans
- Netflix subscription cost
- Netflix subscription mobile/basic/standard/premium
- Netflix subscription family sharing
- Netflix subscription 4K
- Netflix subscription instant delivery
- Buy Netflix subscription Nepal

## Storage

All configuration changes are stored in your browser's **localStorage** under the key: `netflix-config`

This means:
- Changes persist across browser sessions
- Each browser/device has its own configuration
- Clearing browser data will reset to defaults
- No database is required

## Making Changes Live

1. Edit content in `/admin/netflix`
2. See preview in the admin panel
3. Click "Save Changes" - changes are instantly saved
4. Visit `/netflix-in-nepal` to see changes live
5. Changes appear immediately without page reload

## Default Configuration

If you want to reset to the original configuration, clear your browser's localStorage:

```javascript
// In browser console:
localStorage.removeItem('netflix-config')
```

Then refresh the page.

## Adding More Plans

To add additional Netflix subscription plans (beyond the default 4):

1. In the admin panel, you currently have 4 default plans
2. Future enhancement will allow adding custom plans
3. For now, modify existing plans or contact support

## Customization Tips

### For Better SEO
- Include "Netflix subscription" in plan descriptions
- Use natural language with keywords
- Mention specific features like "4K quality", "family sharing", "offline download"

### For Better Conversions
- Make CTA buttons clear and compelling
- Link to product pages where Netflix codes are sold
- Highlight the "Best Value" plan
- Include pricing prominently

### For User Experience
- Keep feature descriptions concise
- List most important features first
- Use clear, benefit-focused language
- Ensure buttons are mobile-friendly

## Troubleshooting

### Changes not saving?
- Check browser console for errors
- Make sure JavaScript is enabled
- Try clearing cache and refreshing

### Can't see changes on the page?
- Refresh the Netflix in Nepal page
- Check that you clicked "Save Changes"
- Make sure localStorage is enabled

### Want to add a custom plan?
- Currently supports the 4 default plans
- Contact your developer to add plan management API

## Future Enhancements

Planned features for the admin panel:
- Add/delete custom Netflix subscription plans
- Image uploads for plan icons
- A/B testing different descriptions
- Analytics on which plans are most viewed
- Bulk edit multiple plans at once
- Dark/light theme toggle

## Support

For issues or feature requests, contact support or file an issue in the repository.
