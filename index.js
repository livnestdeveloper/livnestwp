const axios = require("axios");
const { createBot } = require("whatsapp-cloud-api");

(async () => {
  try {
    // replace the values below from the values you copied above
    const from = "118454207900411";
    const token = process.env.TOKEN;
    const to = "917208320766"; // your phone number without the leading '+'
    const webhookVerifyToken = "livnest"; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);
    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
    });

    const sections_starter = {
      "Section 1": [
        {
          id: "location_40",
          title: "Location",
          description: "Google Location, Nearby location, etc.",
        },
        {
          id: "projectusp_40",
          title: "Project USP",
          description: "In case you are thinking about investment?",
        },
        {
          id: "amenities_40",
          title: "Amenities",
          description: "Show Amenities",
        },
      ],
    };

    const sections_replybutton = {
      "Section 1": [
        {
          id: "location_40",
          title: "Location",
          description: "Google Location, Nearby location, etc.",
        },
        {
          id: "price_40",
          title: "Pricing",
          description: "In case you are thinking about investment?",
        },
        {
          id: "amenities_40",
          title: "Amenities",
          description: "Show Amenities",
        },
        {
          id: "projectstatus_40",
          title: "Project Status",
          description: "Possession Time construction status etc",
        },
        {
          id: "size_40",
          title: "Project Size",
          description: "Project Size flat size etc",
        },
        {
          id: "brochure_40",
          title: "Download Brochure",
          description: "Download Brochure",
        },
        {
          id: "builder_40",
          title: "About the builder",
          description: "see details about the builder",
        },
      ],
    };

    const sections_sitevist = {
      "Site Visit": [
        {
          id: "site_visit_today",
          title: "Today (20-06-2023)",
        },
        {
          id: "site_visit_tommorow",
          title: "Tomorrow (21-06-2023)",
        },
        {
          id: "site_visit_21_06_2023",
          title: "21-06-2023",
        },
      ],
    };

    const sections_time = {
      "Site Visit Date": [
        {
          id: "9_10",
          title: "9-10",
        },
        {
          id: "10_4",
          title: "10-4",
        },
        {
          id: "4_9",
          title: "4-9",
        },
      ],
    };

    const result = await bot.sendList(
      to,
      "Hi",
      "Please select",
      sections_replybutton,
      {
        footerText: "Select",
      }
    );

   // const result = await bot.sendReplyButtons(to,"Choose an option",{site_visit: "Book a Site Visit", main_menu: "Back to Main Menu"});
    //const result = await bot.sendVideo(to,"https://youtu.be/HXKpfGqPRy0");

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      const msgtitle = msg.data.title || "Unknown";
      const booked_site_visit = `Your visit is booked, ${msgtitle}!`;
      const visit_time = `Your Site visit is booked  ${msgtitle}!`;

      console.log(msg);
      if (msg.type === "list_reply" || msg.type === "button_reply") {
        try {
          const msgId = msg.data.id;


          //if the user selects loaction
          if (msgId == "location_40") {
            await bot.sendText(msg.from, "Sure, here is the location");
            await bot.sendLocation(msg.from, 40.7128, -74.006, {
              name: "Viraj Heights",
            });


            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const description = projectData.description;
                await bot.sendReplyButtons(to,`Description: ${description}`,{site_visit_1: "Book a Site Visit", main_menu_1: "Back to Main Menu"});
              }
            }
          } 


          //if the user selects amenitiess
          if (msgId == "amenities_40") {
            await bot.sendText(msg.from, "Sure, here are some examples");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_amenities = projectData.feature;
                await bot.sendReplyButtons(to,`Amenities: ${project_amenities}`,{site_visit_2: "Book a Site Visit", main_menu_2: "Back to Main Menu"});
              }
            }
          }


          //if the user selects Pricing
          if (msgId == "price_40") {
            await bot.sendText(msg.from, "Sure, here The Pricing Details");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_offers = projectData.offer;
                await bot.sendReplyButtons(to,`Offers: ${project_offers}`,{site_visit_3: "Book a Site Visit", main_menu_3: "Back to Main Menu"});
              }
            }
          }

          //if the user clicks on Status
          if (msgId == "projectstatus_40") {
            await bot.sendText(msg.from, "Sure, this is the project status");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_status = projectData.possession_status;
                await bot.sendReplyButtons(to,`Status: ${project_status}`,{site_visit_4: "Book a Site Visit", main_menu_4: "Back to Main Menu"});
              }
            }
          }

          //if the user clicks on Status
          if (msgId == "size_40") {
            await bot.sendText(msg.from, "Sure, this is the project size");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_size = projectData.description_size;
                await bot.sendReplyButtons(to,`Status: ${project_size}`,{site_visit_5: "Book a Site Visit", main_menu_5: "Back to Main Menu"});
              }
            }
          }

          //if the user clicks on Download Brochure
          if (msgId == "brochure_40") {
            await bot.sendText(msg.from, "Sure, this is the project Brocure");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                pdfurl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                await bot.sendDocument(to, pdfurl)
                await bot.sendReplyButtons(to,`Continue Further?`,{site_visit_5: "Book a Site Visit", main_menu_5: "Back to Main Menu"});
              }
            }
          }


          //if the user clicks on About Builder
          if (msgId == "builder_40") {
            await bot.sendText(msg.from, "Sure, this are the Builder Details");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_builder_details = projectData.description;
                await bot.sendReplyButtons(to,`Status: ${project_builder_details}`,{site_visit_5: "Book a Site Visit", main_menu_5: "Back to Main Menu"});
              }
            }
          }

          if (msgId.includes("site_visit")){
            await bot.sendList(
              msg.from,
              `Site Visit`,
              "select a date for the site visit",
              sections_sitevist,
              {
                footerText: "Select a date for the site visit",
              }
            ); 
          }


          if (msgId.includes("main_menu")){
            const result = await bot.sendList(
              to,
              "Hi",
              "Please select",
              sections_replybutton,
              {
                footerText: "Select",
              }
            );
          }


          else if (
            msgId == "site_visit_today" ||
            msgId == "site_visit_tommorow" ||
            msgId == "site_visit_21_06_2023"
          ) {
            await bot.sendList(
              msg.from,
              "Select Time",
              booked_site_visit,
              sections_time,
              {
                footerText: "Select a time for the site visit",
              }
            );
          } 
          
          
          else if (msgId == "9_10" || msgId == "10_4" || msgId == "4_9") {
            await bot.sendText(msg.from, visit_time);
          }
        } 
        
        
        catch (error) {
          console.error("Error:", error);
        }
      }
    });

    // Extract the numeric part from the project ID
    function extractProjectId(id) {
      const parts = id.split("_");
      if (parts.length === 2 && !isNaN(parts[1])) {
        return parts[1];
      }
      return null;
    }

    // Fetch project data from the API
    async function fetchProjectData(projectId) {
      const apiUrl = `http://localhost/project_api/?project_id=${projectId}`;
      try {
        const response = await axios.get(apiUrl);
        return response.data[0];
      } catch (error) {
        console.error("Error fetching project data:", error);
        return null;
      }
    }
  } catch (err) {
    console.log(err);
  }
})();
