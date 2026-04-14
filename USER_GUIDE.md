# USER GUIDE - Receipt Manager

This file explains how the app works from the user's side.
It is separate from `README.md`, which remains the setup and developer run guide.

## 1. What the app does
Receipt Manager is a small receipt system where a user can:
- create an account
- log in
- save business receipt settings
- create receipts
- view saved receipts
- edit or delete saved receipts
- preview and print a selected receipt

Each user has their own receipt settings, so new receipts use that user's shop information.

## 2. Before using the app
You need both parts of the app running.

### Start the backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend runs on:
- `http://localhost:8080`

### Start the frontend
```powershell
cd frontend
npm install
npm run dev
```

The frontend usually runs on:
- `http://localhost:5173`

Open the frontend URL in your browser.

## 3. First time use
When you open the app for the first time, create an account.

### Register
Fill in the registration form with:
- full name
- email
- password
- phone
- address
- business name

Optional fields:
- business phone
- footer message
- website
- tax ID
- logo URL

After registration:
- the account is created
- your receipt settings are initialized from the details you entered
- you are logged in and taken into the app

## 4. Login
If you already have an account:
- open the login page
- enter your email and password
- submit the form

If the details are correct, you enter the app.

## 5. Navigation
Inside the app, use the menu button at the top-right area.
That button opens options for:
- Receipts
- New Receipt
- Settings
- Log out

## 6. Receipt settings
Open `Settings` to control how receipts look.

You can update:
- business name
- address
- phone
- thank you message
- website
- tax ID
- logo URL

These settings are used in the receipt preview and print layout.
Any new receipt will display the current saved business details.

## 7. Creating a receipt
Open `New Receipt`.

Fill in:
- customer name
- date
- payment method
- item name
- quantity
- price

You can:
- add multiple items
- remove item rows
- see the live total before saving

When you save:
- the receipt is stored
- the total is calculated by the backend
- you are taken to the receipt preview page

## 8. Viewing saved receipts
Open `Receipts`.

This page shows the receipts saved by the logged-in user.
For each receipt you can:
- open the preview
- open the three-dot receipt menu
- edit the receipt
- delete the receipt

## 9. Editing a receipt
To edit a saved receipt:
- go to the receipts list or receipt preview
- click the three-dot button
- choose `Edit receipt`

You can then change:
- customer name
- date
- payment method
- items
- quantities
- prices

Save again to update the receipt.

## 10. Deleting a receipt
To delete a saved receipt:
- go to the receipts list or receipt preview
- click the three-dot button
- choose `Delete receipt`
- confirm the action

After deletion, the receipt is removed from your saved list.

## 11. Receipt preview
When you open a receipt, the preview page shows:
- business name
- logo, if a logo URL is saved
- address
- phone
- website, if provided
- tax ID, if provided
- customer name
- date
- payment method
- item rows
- total
- thank you message

The preview uses your current saved receipt settings.

## 12. Printing a receipt
From the receipt preview page:
- click `Print receipt`
- the browser print dialog opens
- print the receipt or save it as PDF from the browser if supported

The print layout is designed to match the preview as closely as possible.

## 13. Notes about logo URL
The logo field expects an image source.
You can use:
- a normal image URL
- a long image data URL if needed

If a logo is saved, it appears in the receipt preview and print layout.
If no logo is saved, the receipt still works normally without it.

## 14. If something looks wrong
Try these quick checks:
- confirm backend is running on `http://localhost:8080`
- confirm frontend is running on `http://localhost:5173`
- refresh the browser with `Ctrl + F5`
- make sure you are logged in

## 15. Summary flow
Typical user flow:
1. Register
2. Log in
3. Open Settings and confirm business details
4. Create a receipt
5. Preview the receipt
6. Print it if needed
7. Return to Receipts to manage saved receipts
