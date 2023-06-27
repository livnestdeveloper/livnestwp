const axios = require("axios");
const { createBot } = require("whatsapp-cloud-api");
//process.env.TOKEN;

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

    // Extract the numeric part from the project ID
    function extractProjectId(id) {
      const parts = id.split("_");
      if (parts.length === 2 && !isNaN(parts[1])) {
        return parts[1];
      }
      return null;
    }

    // Fetch project data from the API
    async function fetchProjectData(project_id) {
      const apiUrl = `https://livnestwp.000webhostapp.com/?project_id=${project_id}`;
      try {
        const response = await axios.get(apiUrl);
        return response.data[0];
      } catch (error) {
        console.error("Error fetching project data:", error);
        return null;
      }
    }

    function extractContext(msg) {
      const id = msg.data.id;
      const regex = /_.*$/;
      const match = id.match(regex);

      if (match) {
        const context = id.slice(0, match.index);
        return context;
      }

      return null; // Return null or handle the case when the pattern is not found
    }

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

   /*  const result = await bot.sendList(
      to,
      "Hi",
      "Please select",
      sections_replybutton,
      {
        footerText: "Select",
      }
    ); */

    // const result = await bot.sendReplyButtons(to,"Choose an option",{site_visit: "Book a Site Visit", main_menu: "Back to Main Menu"});
    //const result = await bot.sendVideo(to,"https://youtu.be/HXKpfGqPRy0");

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      const msgtitle = msg.data.title || "Unknown";
      const customer_name = msg.data.name || "Unknown";
      const booked_site_visit = `Your visit is booked, ${msgtitle}!`;
      const visit_time = `Your Site visit is booked  ${msgtitle}!`;
      const customer_call = `Sure ${customer_name}`

      console.log(msg);
      const project_id = extractProjectId(msg.data.id);
      const context = extractContext(msg);
      console.log(context);
      console.log(project_id);
      if (msg.type === "list_reply" || msg.type === "button_reply") {


        
    const sections_replybutton = {
      "Section 1": [
        {
          id: `location_${project_id}`,
          title: "Location",
          description: "Google Location, Nearby location, etc.",
        },
        {
          id: `price_${project_id}`,
          title: "Pricing",
          description: "In case you are thinking about investment?",
        },
        {
          id: `amenities_${project_id}`,
          title: "Amenities",
          description: "Show Amenities",
        },
        {
          id: `projectstatus_${project_id}`,
          title: "Project Status",
          description: "Possession Time construction status etc",
        },
        {
          id: `size_${project_id}`,
          title: "Project Size",
          description: "Project Size flat size etc",
        },
        {
          id: `brochure_${project_id}`,
          title: "Download Brochure",
          description: "Download Brochure",
        },
        {
          id: `builder_${project_id}`,
          title: "About the builder",
          description: "see details about the builder",
        },
      ],
    };
        
        try {
          const msgId = msg.data.id;

          if (context == "sitevisit") {
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


          if (context == "call") {
            await bot.sendList(
              msg.from,
              "Select Time",
              customer_call,
              sections_time,
              {
                footerText: "Select a time for a Call",
              }
            );
          }

          if (context == "knowmore") {
            await bot.sendList(
              to,
              "Hi",
              "Please select",
              sections_replybutton,
              {
                footerText: "Select",
              }
            );
          }

          //if the user selects loaction
          if (msgId.includes("location")) {
            await bot.sendText(msg.from, "Sure, here is the location");
           
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {    
                const description = projectData.description;
                const longitude = parseFloat(projectData.project_longitude);
                const latitude = parseFloat(projectData.project_latitude);
                await bot.sendLocation(msg.from, longitude, latitude, {
                  name: "Viraj Heights",
                });
                await bot.sendReplyButtons(to, `Description: ${description}`, {
                  site_visit_1: "Book a Site Visit",
                  main_menu_1: "Back to Main Menu",
                });
              }
            }
          }

          //if the user selects amenitiess
          if (msgId.includes("amenities")) {
            await bot.sendText(msg.from, "Sure, here are some examples");
            const projectId = extractProjectId(msg.data.id);
              const projectData = await fetchProjectData(project_id);
              if (projectData) {
                const project_amenities = projectData.feature;
                await bot.sendReplyButtons(
                  to,
                  `Amenities: ${project_amenities}`,
                  {
                    site_visit_2: "Book a Site Visit",
                    main_menu_2: "Back to Main Menu",
                  }
                );
              }else{
                console.log("no project id fetched");
                console.log(project_id);
              }
          }

          //if the user selects Pricing
          if (msgId.includes("price")) {
            await bot.sendText(msg.from, "Sure, here The Pricing Details");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_offers = projectData.offer;
                await bot.sendReplyButtons(to, `Offers: ${project_offers}`, {
                  site_visit_3: "Book a Site Visit",
                  main_menu_3: "Back to Main Menu",
                });
              }
            }
          }

          //if the user clicks on Status
          if (msgId.includes("projectstatus")) {
            await bot.sendText(msg.from, "Sure, this is the project status");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_status = projectData.possession_status;
                await bot.sendReplyButtons(to, `Status: ${project_status}`, {
                  site_visit_4: "Book a Site Visit",
                  main_menu_4: "Back to Main Menu",
                });
              }
            }
          }

          //if the user clicks on Status
          if (msgId.includes("size")) {
            await bot.sendText(msg.from, "Sure, this is the project size");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_size = projectData.description_size;
                await bot.sendReplyButtons(to, `Status: ${project_size}`, {
                  site_visit_5: "Book a Site Visit",
                  main_menu_5: "Back to Main Menu",
                });
              }
            }
          }

          //if the user clicks on Download Brochure
          if (msgId.includes("brochure")) {
            await bot.sendText(msg.from, "Sure, this is the project Brocure");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                pdfurl =
                  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
                await bot.sendDocument(to, pdfurl);
                await bot.sendReplyButtons(to, `Continue Further?`, {
                  site_visit_5: "Book a Site Visit",
                  main_menu_5: "Back to Main Menu",
                });
              }
            }
          }

          //if the user clicks on About Builder
          if (msgId.includes("builder")) {
            await bot.sendText(msg.from, "Sure, this are the Builder Details");
            const projectId = extractProjectId(msg.data.id);
            if (projectId) {
              const projectData = await fetchProjectData(projectId);
              if (projectData) {
                const project_builder_details = projectData.description;
                await bot.sendReplyButtons(
                  to,
                  `Status: ${project_builder_details}`,
                  {
                    site_visit_5: "Book a Site Visit",
                    main_menu_5: "Back to Main Menu",
                  }
                );
              }
            }
          }

          if (msgId.includes("site_visit")) {
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

          if (msgId.includes("main_menu")) {
            const result = await bot.sendList(
              to,
              "Hi",
              "Please select",
              sections_replybutton,
              {
                footerText: "Select",
              }
            );
          } else if (
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
          } else if (msgId == "9_10" || msgId == "10_4" || msgId == "4_9") {
            await bot.sendText(msg.from, visit_time);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
})();
