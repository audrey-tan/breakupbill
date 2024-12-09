"use client"

import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "@/context/GlobalContext.js";
import { useRouter } from "next/navigation";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import emailjs from 'emailjs-com';


export default function Index() {
    // Get global variables from context
    const { items, people, total, subtotal, noEmailPlaceholder } = useContext(GlobalContext);

    // Initialize router to navigate to other pages
    const router = useRouter();

    // Initialize errorMessage, taxFeesTip, billBreakdown, and personTotals
    const [errorMessage, setErrorMessage] = useState<string[] | null>(null);

    const taxFeesTip = total - subtotal;

    let billBreakdown = "";
    let personTotals: { [key: string]: string } = {};

    // Calculates a person's total share and adds their order summary to billBreakdown
    const calculateTotalAndAddToSummary = (name: string) => {
        let personSummary = "";

        let personTotal = 0;
        for (const key in items) { // Iterate through each element in items
            if (items[key]?.people?.[name] && items[key]?.itemCount > 0) { // Check if a person ordered that item and itemCount is greater than 0
                personTotal += items[key].people?.[name] / items[key].itemCount * items[key].price; // Add person's price share of the item to personTotal 
                personSummary += "• " + items[key].people?.[name] + "x " + items[key].name + " — $" + items[key].people?.[name] * items[key].price.toFixed(2) + "<br/>"; // Add person's order of the item to personTotal 
            }
        }

        // Calculate person's share of tax, additional fees, and tip, or divide them equally among all people if substotal is 0
        let extraFees;
        if (!subtotal) { 
            extraFees = taxFeesTip / Object.keys(people).length; 
        }
        else { 
            extraFees = personTotal / subtotal * taxFeesTip; 
        }
        // Add extraFees to personTotal
        personTotal += extraFees;
        // Add extraFees to personSummary
        personSummary += "Extra fees: $" + extraFees.toFixed(2) + "<br/><br/>";

        // Add heading for personSummary
        personSummary = '<div style="font-family: sans-serif; font-size: 12pt; margin-left: 80px;"><strong>' + name + " - $" + personTotal.toFixed(2) + "</strong><br/>" + personSummary + "</div>";

        // Add personSummary for billBreakdown
        billBreakdown += personSummary;
        // Save personTotal to personTotals
        personTotals[name] = personTotal.toFixed(2);
        
        return personTotal;
    };

    // Called when "Send Emails" button is pressed
    const handleEmail = () => {
        // Iterate through each person
        for (const [name, email] of Object.entries(people) as [string, string][]) {
            // Continue if email was not added
            if (email === noEmailPlaceholder) {
                continue;
            }
            // Send email
            sendEmail(email, name, personTotals[name], billBreakdown);
        }
    }

    // Send email
    const sendEmail = (to_email: string, to_name: string, total_amount: string, bill_breakdown: string) => {
        const emailParams = {
          to_email: to_email,
          to_name: to_name,
          total_amount: total_amount,
          bill_breakdown: bill_breakdown,
        };
        
        emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "", process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "", emailParams, process.env.NEXT_PUBLIC_EMAILJS_USER_ID || "")
          .then((result) => {
            console.log('Email sent successfully.');
          })
          .catch((error) => {
            throw error;
          });
      }
    
    // Called when component mounts
    useEffect(() => {
        // Function to get the items where no person was assigned to
        const getUnassignedItems = () => {
            return Object.keys(items)
                .filter(
                    (key) => !items[key].people || Object.keys(items[key].people).length === 0 || Object.values(items[key].people).every(value => value === 0)
                )
                .map((key) => items[key].name);
        };

        let message = [];

        // If subtotal is 0, add this message
        if (!subtotal) {
            message.push("Subtotal is $0.00, so additional fees and tip weres split evenly.");
        } 

        // Call getUnassignedItems()
        const unassignedItems = getUnassignedItems();
        if (unassignedItems.length > 0) { // If there are items with no people assigned,
            if (message.length > 0) {
                message.push(" ");
            }
            message.push("Items:");
            for (const name of unassignedItems) { // add message with each unassigned item mentioned
                message.push("     • " + name);
            }
            message.push("were not assigned to anyone, so the sum each person pays may not match the actual total.");
        }

        // Set errorMessage to message
        setErrorMessage(message);
    }, []);


    return (
        <>
            <div className="fixed top-[12%] left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 md:px-0">
                <h1 className="px-5 mt-2 mb-3 font-bold text-center text-lg md:text-xl">
                    TOTAL
                </h1>
                <h2 className="px-5 mb-4 font-bold text-center text-violet-700 text-4xl md:text-5xl">
                    ${total.toFixed(2)}
                </h2>
            </div>
            <div className="fixed top-[28%] left-1/2 transform -translate-x-1/2 w-full max-w-lg h-3/4 bg-[#F6F6F6] shadow-xl rounded-t-3xl">
                <div className="flex flex-col items-start justify-start pt-5 px-10 h-full">
                    <div className="overflow-y-scroll scrollbar w-full h-[67%] mt-4 py-2 flex flex-col space-y-6 pb-6 px-3">
                        <div style={{ whiteSpace: 'pre-wrap' }} className="font-medium text-gray-400 text-sm md:text-base ml-2">
                            {errorMessage?.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                        {Object.entries(people as Record<string, string>).reverse().map(([name, email]) => (
                            <div key={name} className="flex w-full items-center justify-between space-x-3 bg-white shadow-lg rounded-2xl py-10 px-6 md:px-8">
                                <div className="flex flex-col w-[55%]">
                                    <span className="font-bold text-violet-700 text-xl break-words">{name}</span>
                                    <span className="font-medium text-sm text-gray-500 break-words">{email}</span>
                                </div>
                                <span className="text-violet-700 text-2xl md:text-3xl font-bold w-[43%] md:w-[35%] text-right break-words">${calculateTotalAndAddToSummary(name).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-9 px-4 flex flex-col w-full gap-4">
                        <Button variant="default" className="bg-gradient-to-r from-violet-500 to-indigo-700 hover:from-violet-400 hover:to-indigo-600" onClick={handleEmail}>
                            <Mail/>
                            Send emails
                        </Button>
                        <Button variant="outline" className="text-indigo-700 border-indigo-500 hover:text-indigo-700 bg-[#F6F6F6]" onClick={() => router.push("/")}>
                            Back to home
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
