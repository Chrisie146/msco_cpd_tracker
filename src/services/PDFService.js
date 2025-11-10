import { jsPDF } from "jspdf";

class PDFService {
  static generateReport(completedActivities, careerData, userInfo = {}, learningNeeds = [], plannedActivities = []) {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    let yPosition = margin;

    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 55, 109);
    doc.text("SAICA CPD Tracker", pageWidth / 2, 50, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Continuing Professional Development Report", pageWidth / 2, 70, { align: "center" });

    yPosition = 100;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    const currentDate = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
    const memberName = userInfo.firstName + " " + userInfo.surname;
    doc.text("Member: " + (memberName.trim() || "[Member Name]"), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("Membership #: " + (userInfo.membershipNumber || "[Membership Number]"), pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("Report Date: " + currentDate, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.text("Year: " + new Date().getFullYear(), pageWidth / 2, yPosition, { align: "center" });

    doc.addPage();
    yPosition = margin;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 55, 109);
    doc.text("PHASE ONE: THE PLANNING PHASE", margin, yPosition);
    yPosition += 12;

    doc.setDrawColor(25, 55, 109);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Career Path & Industry Focus", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const careerPathText = careerData.careerPath || "[Not entered]";
    const careerPathLines = doc.splitTextToSize(careerPathText, pageWidth - 2 * margin);
    careerPathLines.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 5;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Current Position", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Title/Role: " + (careerData.currentPosition || "[Not entered]"), margin, yPosition);
    yPosition += 6;
    doc.text("Years in Role: " + (careerData.yearsInRole || "[Not entered]"), margin, yPosition);
    yPosition += 8;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Career Goals", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bolditalic");
    doc.text("Short-term (Next 12 months):", margin, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const shortTermText = careerData.shortTermGoals || "[Not entered]";
    const shortTermLines = doc.splitTextToSize(shortTermText, pageWidth - 2 * margin - 5);
    shortTermLines.forEach(line => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bolditalic");
    doc.text("Long-term (Beyond 12 months):", margin, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const longTermText = careerData.longTermGoals || "[Not entered]";
    const longTermLines = doc.splitTextToSize(longTermText, pageWidth - 2 * margin - 5);
    longTermLines.forEach(line => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 5;

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Competencies Expected in This Role", margin, yPosition);
    yPosition += 6;

    // Competencies definitions lookup
    const competenciesDefinitions = {
      "Personal ethics": "Adhering to moral and ethical principles in personal conduct",
      "Business ethics": "Understanding and applying ethical principles in business contexts",
      "Professional ethics": "Maintaining professional standards and conduct",
      "Adaptive Mind-set": "Willingness to adapt to change and new situations",
      "Agility": "Ability to move quickly and effectively respond to challenges",
      "Inquisitiveness": "Curiosity and desire to learn and explore new knowledge",
      "Self-development": "Commitment to continuous personal and professional growth",
      "Personal citizenship": "Contributing positively to society as an individual",
      "Business citizenship": "Acting responsibly within business communities",
      "Professional citizenship": "Upholding professional responsibilities",
      "Global citizenship": "Understanding and respecting global perspectives",
      "Business external environment": "Understanding market forces and external factors",
      "Business internal environment": "Knowledge of organizational structure and operations",
      "Planning and organising": "Ability to set objectives and coordinate resources",
      "Computational thinking": "Logical problem-solving using computational methods",
      "Cyber security": "Understanding and implementing information security",
      "Data analytics": "Extracting insights from data",
      "Database management": "Managing data systems effectively",
      "Digital affinity": "Comfort and familiarity with technology",
      "Digital familiarity": "Understanding digital tools and platforms",
      "Digital impact": "Understanding technology effects on business",
      "Digital user skills": "Proficiency with digital tools and platforms",
      "Interdigital relationships": "Managing digital interactions and connections",
      "Analytical thinking": "Breaking down complex problems into components",
      "Critical thinking": "Evaluating information objectively",
      "Effective decision-making": "Making sound choices with available information",
      "Entrepreneurial thinking": "Identifying and pursuing business opportunities",
      "Innovative thinking": "Generating creative solutions",
      "Integrated thinking": "Connecting diverse ideas and information",
      "Judgement": "Making well-reasoned professional assessments",
      "Numerical reasoning": "Working effectively with numbers and data",
      "Problem solving": "Finding practical solutions to challenges",
      "Professional scepticism": "Maintaining questioning mindset in professional work",
      "Strategic thinking": "Long-term perspective and planning",
      "Sustainable mind-set": "Considering environmental and social impacts",
      "Value creation mind-set": "Focus on creating stakeholder value",
      "Communication skills": "Expressing ideas clearly to diverse audiences",
      "Emotional display": "Appropriately showing emotions in professional settings",
      "Emotional regulation": "Managing one's emotional responses",
      "Emotional resilience": "Recovering from setbacks and challenges",
      "Leadership skills": "Ability to guide and inspire others",
      "Managing others": "Effectively supervising and developing team members",
      "Relationship-building skills": "Establishing and maintaining professional relationships",
      "Self-management": "Managing one's time, emotions and performance",
      "Teamwork / people skills": "Working effectively with others",
      "Assurance engagements": "Providing independent professional assurance",
      "Audits of historical financial statements": "Conducting audit procedures",
      "External financial decision-making": "Supporting stakeholder financial decisions",
      "Financial management": "Managing financial resources and planning",
      "Governance model": "Understanding organizational governance structures",
      "Internal financial decision-making": "Supporting management financial decisions",
      "Reporting fundamentals": "Understanding financial reporting standards",
      "Automation management": "Implementing and managing automated processes",
      "Business processes implementation": "Designing and executing business workflows",
      "Business strategy": "Developing and implementing strategic plans",
      "Business system applications": "Using technology for business operations",
      "Change management": "Managing organizational transitions effectively",
      "Design and innovate": "Creating new solutions and improvements",
      "Investment decisions": "Evaluating and making investment choices",
      "Operational decision-making": "Making day-to-day operational choices",
      "Project implementation": "Delivering projects on time and within scope",
      "Quality assurance": "Ensuring products and services meet standards",
      "Resource mobilisation": "Acquiring and allocating organizational resources",
      "Laws and regulations": "Understanding legal and regulatory requirements",
      "Managing uncertainty": "Navigating ambiguous situations",
      "Risk and asset management": "Identifying and mitigating organizational risks",
      "Stakeholder management": "Managing relationships with key stakeholders",
      "Tax governance": "Ensuring tax compliance and governance",
      "Tax planning": "Optimizing tax strategies within regulatory bounds",
      "New developments and protocols knowledge": "Staying current with industry changes",
      "Providing advice": "Offering informed recommendations",
      "Review, analyse and monitor": "Examining information critically and tracking performance"
    };

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (Array.isArray(careerData.competenciesExpected) && careerData.competenciesExpected.length > 0) {
      careerData.competenciesExpected.forEach((competency, index) => {
        if (yPosition > pageHeight - margin - 15) {
          doc.addPage();
          yPosition = margin;
        }

        const bullet = String.fromCharCode(8226);
        doc.setFont("helvetica", "bold");
        doc.text(bullet + " " + competency, margin + 2, yPosition);
        yPosition += 4;

        const definition = competenciesDefinitions[competency];
        if (definition) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          const defLines = doc.splitTextToSize(definition, pageWidth - 2 * margin - 6);
          defLines.forEach(line => {
            doc.text(line, margin + 6, yPosition);
            yPosition += 4;
          });
          doc.setFontSize(10);
        }
        yPosition += 2;
      });
    } else {
      doc.text("[No competencies selected]", margin + 2, yPosition);
      yPosition += 5;
    }

    // Add Learning Needs section
    yPosition += 8;
    if (yPosition > pageHeight - margin - 30) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Competency Development Needs", margin, yPosition);
    yPosition += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    if (Array.isArray(learningNeeds) && learningNeeds.length > 0) {
      learningNeeds.forEach((need, index) => {
        if (yPosition > pageHeight - margin - 25) {
          doc.addPage();
          yPosition = margin;
        }

        // Course name
        doc.setFont("helvetica", "bold");
        doc.text((index + 1) + ". " + (need.courseName || "[Course/Activity]"), margin + 2, yPosition);
        yPosition += 6;

        // Competencies targeted
        if (need.competencyId && need.competencyId.trim()) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.text("Competencies: ", margin + 5, yPosition);
          const competencies = need.competencyId.split(',').map(c => c.trim()).filter(c => c);
          const compText = competencies.join(', ');
          const compLines = doc.splitTextToSize(compText, pageWidth - 2 * margin - 25);
          let xOffset = margin + 5 + doc.getTextWidth("Competencies: ");
          doc.text(compLines[0], xOffset, yPosition);
          yPosition += 4;
          for (let i = 1; i < compLines.length; i++) {
            doc.text(compLines[i], margin + 5, yPosition);
            yPosition += 4;
          }
          doc.setFontSize(10);
        } else {
          yPosition += 2;
        }

        // What prompted this need
        if (need.needPrompt && need.needPrompt.trim()) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.text("Prompted by: ", margin + 5, yPosition);
          const promptLines = doc.splitTextToSize(need.needPrompt, pageWidth - 2 * margin - 22);
          let xOffset = margin + 5 + doc.getTextWidth("Prompted by: ");
          doc.text(promptLines[0], xOffset, yPosition);
          yPosition += 4;
          for (let i = 1; i < promptLines.length; i++) {
            doc.text(promptLines[i], margin + 5, yPosition);
            yPosition += 4;
          }
          doc.setFontSize(10);
        }
        
        yPosition += 5;
      });
    } else {
      doc.text("[No learning needs identified]", margin + 2, yPosition);
      yPosition += 5;
    }

    // Add Phase Two: The Action Phase
    yPosition += 10;
    if (yPosition > pageHeight - margin - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 55, 109);
    doc.text("PHASE TWO: THE ACTION PHASE", margin, yPosition);
    yPosition += 12;

    doc.setDrawColor(25, 55, 109);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Planned CPD Activities", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (Array.isArray(plannedActivities) && plannedActivities.length > 0) {
      plannedActivities.forEach((activity, index) => {
        if (yPosition > pageHeight - margin - 40) {
          doc.addPage();
          yPosition = margin;
        }

        // Activity number and name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text((index + 1) + ". " + (activity.courseName || activity.activity || "[Activity Name]"), margin + 2, yPosition);
        yPosition += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Competency
        if (activity.competencyName) {
          doc.text("Competency: " + activity.competencyName, margin + 5, yPosition);
          yPosition += 5;
        }

        // Activity Type
        const activityTypeLabel = activity.activityType === 'formal' ? 'Formal CPD' : 
                                  activity.activityType === 'informal' ? 'Informal CPD' : 
                                  activity.activityType === 'verifiable' ? 'Verifiable CPD' : 
                                  activity.activityType || 'Not specified';
        doc.text("Type: " + activityTypeLabel, margin + 5, yPosition);
        yPosition += 5;

        // CPD Hours
        if (activity.cpdHours || activity.hours) {
          doc.text("CPD Hours: " + (activity.cpdHours || activity.hours), margin + 5, yPosition);
          yPosition += 5;
        }

        // Planned Date
        if (activity.plannedDate) {
          const plannedDateFormatted = new Date(activity.plannedDate).toLocaleDateString('en-ZA');
          doc.text("Planned Date: " + plannedDateFormatted, margin + 5, yPosition);
          yPosition += 5;
        }

        // Status
        const statusLabel = activity.status === 'planned' ? 'Planned' :
                           activity.status === 'inProgress' ? 'In Progress' :
                           activity.status === 'completed' ? 'Completed' :
                           activity.status === 'cancelled' ? 'Cancelled' :
                           activity.status || 'Planned';
        doc.setFont("helvetica", "bold");
        doc.text("Status: ", margin + 5, yPosition);
        doc.setFont("helvetica", "normal");
        const statusColor = activity.status === 'completed' ? [0, 128, 0] :
                           activity.status === 'inProgress' ? [255, 165, 0] :
                           activity.status === 'cancelled' ? [255, 0, 0] :
                           [0, 0, 255];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(statusLabel, margin + 5 + doc.getTextWidth("Status: "), yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;

        // Certification
        if (activity.certification === 'yes') {
          doc.setFont("helvetica", "italic");
          doc.text("✓ Certification obtained/expected", margin + 5, yPosition);
          doc.setFont("helvetica", "normal");
          yPosition += 5;
        }

        // Notes
        if (activity.notes && activity.notes.trim()) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.text("Notes: ", margin + 5, yPosition);
          const notesLines = doc.splitTextToSize(activity.notes, pageWidth - 2 * margin - 18);
          let xOffset = margin + 5 + doc.getTextWidth("Notes: ");
          doc.text(notesLines[0], xOffset, yPosition);
          yPosition += 4;
          for (let i = 1; i < notesLines.length; i++) {
            doc.text(notesLines[i], margin + 5, yPosition);
            yPosition += 4;
          }
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
        }

        yPosition += 6;
      });
    } else {
      doc.text("[No planned activities]", margin + 2, yPosition);
      yPosition += 5;
    }

    // Completed Activities Section
    yPosition += 10;
    if (yPosition > pageHeight - margin - 30) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Completed CPD Activities", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (Array.isArray(completedActivities) && completedActivities.length > 0) {
      completedActivities.forEach((activity, index) => {
        if (yPosition > pageHeight - margin - 40) {
          doc.addPage();
          yPosition = margin;
        }

        // Activity number and name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text((index + 1) + ". " + (activity.courseName || activity.activity || "[Activity Name]"), margin + 2, yPosition);
        yPosition += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Competency
        if (activity.competencyName) {
          doc.text("Competency: " + activity.competencyName, margin + 5, yPosition);
          yPosition += 5;
        }

        // Activity Type
        const activityTypeLabel = activity.activityType === 'formal' ? 'Formal CPD' : 
                                  activity.activityType === 'informal' ? 'Informal CPD' : 
                                  activity.activityType === 'verifiable' ? 'Verifiable CPD' : 
                                  activity.activityType || 'Not specified';
        doc.text("Type: " + activityTypeLabel, margin + 5, yPosition);
        yPosition += 5;

        // CPD Hours
        if (activity.cpdHours || activity.hours) {
          doc.text("CPD Hours: " + (activity.cpdHours || activity.hours), margin + 5, yPosition);
          yPosition += 5;
        }

        // Completed Date (if available)
        if (activity.date) {
          const completedDateFormatted = new Date(activity.date).toLocaleDateString('en-ZA');
          doc.text("Completed Date: " + completedDateFormatted, margin + 5, yPosition);
          yPosition += 5;
        }

        // Status - show as completed
        doc.setFont("helvetica", "bold");
        doc.text("Status: ", margin + 5, yPosition);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 128, 0);
        doc.text("Completed", margin + 5 + doc.getTextWidth("Status: "), yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;

        // Certification
        if (activity.certification === 'yes') {
          doc.setFont("helvetica", "italic");
          doc.text("✓ Certification obtained", margin + 5, yPosition);
          doc.setFont("helvetica", "normal");
          yPosition += 5;
        }

        // Notes
        if (activity.notes && activity.notes.trim()) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(8);
          doc.text("Notes: ", margin + 5, yPosition);
          const notesLines = doc.splitTextToSize(activity.notes, pageWidth - 2 * margin - 18);
          let xOffset = margin + 5 + doc.getTextWidth("Notes: ");
          doc.text(notesLines[0], xOffset, yPosition);
          yPosition += 4;
          for (let i = 1; i < notesLines.length; i++) {
            doc.text(notesLines[i], margin + 5, yPosition);
            yPosition += 4;
          }
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
        }

        yPosition += 6;
      });
    } else {
      doc.text("[No completed activities]", margin + 2, yPosition);
      yPosition += 5;
    }

    // Add Phase Three: The Reflection Phase
    yPosition += 10;
    if (yPosition > pageHeight - margin - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 55, 109);
    doc.text("PHASE THREE: REFLECTION & FUTURE LEARNING", margin, yPosition);
    yPosition += 12;

    doc.setDrawColor(25, 55, 109);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const activitiesWithReflections = completedActivities.filter(a => a.reflection || a.futureLearning);
    
    if (activitiesWithReflections.length > 0) {
      activitiesWithReflections.forEach((activity, index) => {
        if (yPosition > pageHeight - margin - 50) {
          doc.addPage();
          yPosition = margin;
        }

        // Activity number and name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text((index + 1) + ". " + (activity.courseName || activity.activity || "[Activity Name]"), margin + 2, yPosition);
        yPosition += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        // Competency and hours
        if (activity.competencyName || activity.developmentArea) {
          doc.setTextColor(60, 60, 60);
          const competencyText = (activity.competencyName || activity.developmentArea) + " • " + ((activity.cpdHours || activity.hours) || 0) + " hours";
          doc.text(competencyText, margin + 5, yPosition);
          doc.setTextColor(0, 0, 0);
          yPosition += 8;
        }

        // My Reflection of the Learning Intervention
        if (activity.reflection && activity.reflection.trim()) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("My Reflection of the Learning Intervention:", margin + 5, yPosition);
          yPosition += 6;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const reflectionLines = doc.splitTextToSize(activity.reflection, pageWidth - 2 * margin - 10);
          reflectionLines.forEach(line => {
            if (yPosition > pageHeight - margin - 15) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin + 7, yPosition);
            yPosition += 4.5;
          });
          yPosition += 5;
        }

        // Future Learning Related to This Area
        if (activity.futureLearning && activity.futureLearning.trim()) {
          if (yPosition > pageHeight - margin - 20) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text("Future Learning Related to This Area:", margin + 5, yPosition);
          yPosition += 6;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          const futureLines = doc.splitTextToSize(activity.futureLearning, pageWidth - 2 * margin - 10);
          futureLines.forEach(line => {
            if (yPosition > pageHeight - margin - 15) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(line, margin + 7, yPosition);
            yPosition += 4.5;
          });
          yPosition += 5;
        }

        yPosition += 6;
      });
    } else {
      doc.text("[No reflections recorded yet]", margin + 2, yPosition);
      yPosition += 5;
    }

    doc.save("SAICA_CPD_Report.pdf");
  }
}

export { PDFService };
export default PDFService;
