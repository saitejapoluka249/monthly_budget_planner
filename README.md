# Monthly Budget Planner Project

This project is a full-stack web application built using **Node.js**, **Express**, **MongoDB**, and **AWS**. It helps users track their monthly income, expenses, and savings, providing an interactive and user-friendly interface to manage their finances. The app includes visual representations like doughnut charts, bar graphs, line graphs, and pie charts to display the data.

## Features

### User Authentication:
- **Login** and **Sign Up** pages.
- User authentication with **bcrypt** for password hashing and **JWT** for session management.

### Dashboard:
- Displays **current month’s income, expenses**, and **savings** in a tabular format.
- **Graphical representations** such as:
  - Doughnut chart
  - Bar graph
  - Line graph
  - Pie chart
  
### Financial Management:
- **My Income**, **My Expenses**, and **My Saving** sections to view current month data.
- The option to check **past statistics** for income and expenses.
- Alerts sent via **email** to users when their expenses exceed their income at the end of the month.

### Additional Features:
- **Timeline** to track important events or actions.
- **Todo List** to manage tasks.
- **Profile View** section for users to manage their personal information.
- Admin can receive **email alerts** containing user budget details.
  
### Email Notifications:
- Users will receive **email alerts** if their expenses exceed their income at the end of the month.
- **Admin** gets a summary email of the user's budget details every month.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/monthly-budget-project.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up MongoDB:
   - Ensure that MongoDB is running locally or use a cloud database (MongoDB Atlas).
   - Set the correct database URL in the `app.js` file.
   
4. Set up AWS credentials:
    - Make sure to configure your **AWS SDK** credentials (e.g., access key, secret key).
    - Set the region for **AWS SES** (Simple Email Service) in the `app.js` file.

5. Configure environment variables:
    - In the `app.js`, set your email and password to use with **nodemailer**.
    - You can also use environment variables to store sensitive credentials securely.

## Running the App

Once everything is set up, you can run the app with:

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Routes

- `/login` – Login page
- `/signup` – Sign-up page
- `/home` – Home page (User dashboard)
- `/forgot` – Forgot password page
- `/profile` – View and edit user profile
- `/timeline` – View your timeline of events
- `/todo` – Todo list page
- `/saving` – View savings page
- `/graph` – View various graphs of your financial data

## Technologies Used

- **Node.js** - Server-side runtime environment
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **AWS SES & SNS** - For sending email alerts
- **bcrypt** - Password hashing and validation
- **JWT** - JSON Web Tokens for authentication
- **EJS** - Template engine for rendering views
- **Chart.js** - For graphical data representation (pie, line, bar, doughnut charts)
- **Nodemailer** - For email functionality

## Contributing

If you would like to contribute to the project, please fork the repository, create a branch for your feature or bug fix, and submit a pull request.


## Working Demo Samples

You guys can check at screenshots folder

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

 
