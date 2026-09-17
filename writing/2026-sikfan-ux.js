export default {
  published: true,
  title: "Designing SikFan's User Experience",
  year: "2026",
  meta: "September 2026",
  readTime: "9 min read",
  dek: "How I created the requirements to determine model architecture",
  body: [
    { heading: "What does success look like" },
    "My goal was to increase my time in range by predicting the blood glucose impact based on the nutritional profile of my meals to inform my insulin dosage. Time in range is the time spent within a specified glucose range (the standard being 70–180 mg/dL). The more time a diabetic spends within this range, the more stable their blood glucose and the less they experience symptoms of hypo- and hyperglycemia.",

    { heading: "Defining the user experience" },
    { subheading: "Who is the user?" },
    "Me, duh! A type 1 diabetic who typically eats food of the east Asian cuisine. While I use a CGM and insulin pump, this app should still be usable by those who don't — especially since there are some days where I rely on manual injections.",
    { note: "If you want to read why I'm building this, check out ", linkText: "my article on the story behind SikFan", linkSlug: "sikfan-lets-eat", after: "." },

    { subheading: "What does the user need to inform their insulin dosage?" },
    "In order to inform how much insulin to take, a diabetic needs to understand, at minimum, the following things:",
    { numbered: [
      "The amount of carbohydrates, fat, and fiber in a meal that will be consumed",
      "Their blood glucose at that moment",
      "The general glycemic index of the ingredients in the dish, which affects how fast glucose is absorbed by the bloodstream",
      "How far in advance the insulin should be taken prior to the meal (pre-bolusing)"
    ] },

    { subheading: "Nutritional information" },
    "This could be determined based on the photo of the meal with a vision model and connection to a nutritional database API or dataset.",

    { subheading: "Blood glucose at time of eating" },
    "This could be either manually entered or retrieved through a CGM API integration. Because Dexcom's API integration results in a three hour delay, and I wanted to allow an entry point for days I don't wear a CGM, I decided to let the user manually enter the blood glucose for the MVP.",

    { subheading: "Glycemic index" },
    "This is where it gets tricky. There are not many datasets that have glycemic indexes readily available for individual food items; additionally, everyone's rate of absorption will vary even if they eat the same food.",
    "So to give myself an idea about the glycemic index, I decided to use a form of regression glucose model that could tell me whether this type of food typically spikes, stabilizes, or drops my blood glucose based on prior meal data.",
    "Typical regression models return a forecasted numerical output for a Y variable based on input variables. In this case, the output would be the predicted blood glucose value ~2 hours after eating a meal, with the input being the nutritional information, beginning blood glucose value, and time.",
    "However, just telling a user that their blood sugar will be 168 after eating a certain meal isn't valuable — in fact, it's too granular. When calculating my insulin dosage, I just want to know in general if the food I'm eating will really spike my blood glucose or not.",
    "So instead of displaying the raw numerical prediction, I decided to create UI labels based on numeric ranges:",
    { labels: [
      { label: "SPIKE", def: "2-hour post-meal glucose is 40+ mg/dL greater than mealtime glucose" },
      { label: "DROP", def: "2-hour post-meal glucose is more than 20 mg/dL lower than mealtime glucose" },
      { label: "STEADY", def: "2-hour post-meal glucose sits between drop and spike, compared to mealtime glucose" }
    ] },
    "These labels are displayed in the UI along with a blood glucose curve, allowing the user to understand glucose impact at a glance while still maintaining the precision of the model.",

    { subheading: "Insulin dosage timing" },
    "Rapid-acting insulin does not take effect at the time of injection. Instead, it begins its onset at 15 minutes and can take up to 60 minutes to become fully absorbed through the bloodstream and lower blood glucose.",
    "I decided to exclude this factor in my MVP because the information is not easily accessible through an API like CGM data. Additionally, it isn't required to calculate the dosage amount — it's used to keep one's blood glucose as stable as possible during and after a meal.",

    { heading: "How will the user get the information needed?" },
    "A major pain point of most nutrition apps is needing to manually enter the dish name and ingredients to get the total nutrition information. Most apps now mitigate this by letting users simply take a photo of their food and using LLMs to identify the type of food and its nutritional information (or by connecting to nutritional databases via APIs).",
    "I knew I wanted a similar experience, where a user can find the information they need with a simple snap of a picture. Instead of using an LLM, I ended up using a vision model comprised of FastSAM/CLIP with the LLM as a fallback only. Why I didn't use an LLM for computer vision is explored further in another article.",
    { figure: "capture" },

    { subheading: "What happens if the model is wrong?" },
    "Despite the technological advances in machine learning and artificial intelligence in recent years, models are not perfect. They overfit, hallucinate, or simply insist that something is X when it really isn't.",
    "Because I am building an application that relies on a model to help inform a health decision — especially one as critical as insulin dosage — I knew I needed to allow myself to update and edit the predicted outputs.",
    "If the predicted blood glucose impact is incorrect, then it's less likely due to the glucose regression model and more likely due to the output of the vision model. Why? Because the regression model is calculated statistically on structured data, while the vision model uses unstructured meal data to develop pattern recognition. The vision model incorrectly identifying dish components or portion would affect final post-meal glucose more than the regression model being a few numbers off.",
    "This means that instead of correcting the blood glucose or nutritional data, I needed to allow myself to correct the actual dish composition and portion. Not only did I design SikFan to let the user edit the dish name, component list, and portion size, but I also chose to display the vision model's confidence score to indicate whether they might need to correct the dish. Once I correct a dish, my glucose model updates based on the correctly identified composition and portion values.",
    { figure: "edit" },

    { subheading: "I'm happy with the prediction — now what?" },
    "The whole reason I'm building this is to provide a comprehensive picture, meaning I don't just want to understand how one dish affects me. Instead, I wanted to build a meal log so I could quickly browse and understand how certain foods impact my blood glucose at the broader level.",
    "Furthermore, SikFan fits my specific needs because the models are trained and built on my personal data. To prevent them from going stale, I needed to ensure that with each logged meal prediction, my vision model would improve and get better at recognizing what I was eating. I didn't want to constantly update a dataset or hardcode rules — it had to be self-learning.",
    { figure: "log" },

    { heading: "The final user experience" },
    "Once I developed my user experience and design, I could determine my model architecture based on the following requirements:",
    { bulleted: [
      "As a user, when I take a picture of my meal, I should be able to enter my current blood sugar manually, and then see a screen displaying my predicted blood glucose impact and the nutritional breakdown of my dish.",
      "If I believe the macros of my meal are incorrect, I should be able to edit the composition of my meal or portion size at the ingredient level and see an updated glucose prediction.",
      "Once I'm satisfied with the predicted impact, I should be able to log this meal so I can identify patterns for future meals and understand how certain dishes affect my blood sugar.",
      "With every dish, the models should become better at recognizing what I'm eating and grow more accurate at predicting how my blood glucose will be affected."
    ] },
    "SikFan ended up using a Gaussian Process Regression (GPR) model to predict glucose, layered on top of a vision model comprised of FastSAM/CLIP with an LLM fallback for food recognition. Stay tuned for another article diving deep into how I chose these models, and more on when the LLM is used."
  ]
};
