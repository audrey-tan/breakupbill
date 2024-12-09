Welcome to BreakUp!

VIDEO LINK: [https://youtu.be/nGrhoOkp-lY]

Table of contents:
• Introduction
• Important notes
• Prerequisites
• How to run the project
• Troubleshooting
• Features


Introduction
Tired of pulling out a calculator to split your bill? BreakUp is a web app designed to help you split their bills after a enjoying a nice meal with your friends! Simply take a picture of your receipt to automatically scan it, assign items to your friends, and let BreakUp do all the tedious calculations for you!

Need a quick way to see BreakUp in action? Check out the deployed version by clicking [https://breakupbills.vercel.app/].


Important notes

If running on phone, please use the deployed version [https://breakupbills.vercel.app/] as camera access may not be avaiable with unsecured local hosting.

BreakUp uses Veryfi API to parse receipt images on its free tier, which has a 100 limit per month, and EmailJS to send emails, with a 200 limit per month. If these limits are reached, the web app would still be functional albeit with the image receipt parsing and email functions unavailable. For the submission of this project, new accounts on Veryfi and EmailJS were created. Therefore, there should still be plenty of usages left. However, if you'd like (though not necessary), you can easily update the .env with your own credentials to connect them to other Verify and EmailJS accounts.


Prerequisites:
1. Node.js and npm
    Follow the steps on https://nodejs.org/en/download/package-manager (v.22.12.0 LTS) to install Node.js (npm should come with it).
    Check that the installations are successful by running "node -v" and "npm -v".
2. Dependencies
    Ensure that you are in the "splitbill" directory.
    Run "npm install" to install dependencies.
    

How to run the project:
1. Ensure that you are in the "splitbill" directory.
2. Run "npm run dev" to run the project.


Troubleshooting:
• "zsh: command not found: npm" error 
    Run "source ~/.nvm/nvm.sh" to load nvm into your shell session.
• "Cannot find module [module name]" error
    Run "npm install [module name]" to install the module.
• Still having trouble running the project? No worries! You can check out the deployed version of BreakUp [https://breakupbills.vercel.app/]. 


Features:
1. On the Home page, press the Start button.
2. On the Receipt page, allow camera permissions on your browser if needed, then take a picture of your receipt.
3. On the Edit Bill page, you can:
        - add a new item at the bottom of the list of items by pressing the + button;
        - delete an item by pressing the x button on the right side of the corresponding item;
        - view more items (if available) by scrolling the list of items;
        - edit the name and/or price of an item; and
        - edit the tax and additional fees and tip value.
4. On the Add People page, you can: 
        - add people by typing their names (required) and email addresses (optional), 
            note: names must be unique;
        - delete people by pressing the x button on the right side of a person; and
        - view more people (if available) by scrolling the list of people.
5. On the Assign People page, you can:
        - select a person by tapping on their name;
        - increment the number of items the selected person ordered using the + button on the corresponding item;
        - decrement the number of items the selected person ordered using the - button on the corresponding item;
        - view more people (if available) by scrolling horizontally the list of people; and
        - view more items (if available) by scrolling the list of items; and
        - press the Calculate button to go to the results page and calculate each person's share.
6. On the Results page, you can:
        - view each person's share ans scroll to view more (if available); and
        - press the Send Emails button to send emails to each person with an email added of their total share and the split bill breakdown. 