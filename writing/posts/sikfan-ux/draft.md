What does success look like:
My goal was to increase my time in range by predicting the blood glucose impact based on the nutritional profile of my meals to inform my insulin dosage. Time in range is the time spent within a specified glucose range (the standard being 70 – 180 mg/dL). The more time a diabetic spends within this range, the more stable their blood glucose and the less they experience symptoms of hypo and hyperglycemia.
Defining the User Experience:
Who is the user? 
Me, duh! If you want to read why I’m building this, check out my intro article! 
A type 1 diabetic who typically eats food of the east Asian cuisine. While I utilize a CGM and insulin pump but, this app should still be usable by those who don’t, especially since there are some days where I rely on manual injections.
What does the user need to inform their insulin dosage: 
In order to inform how much insulin to take, a diabetic needs to understand, at minimum, the following things:
1.	The amount of carbohydrates, fat, and fiber in a meal that will be consumed
2.	Their blood glucose at that moment
3.	The general glycemic index of the ingredients in the dish, which affect how fast glucose is absorbed by the bloodstream
4.	How far in advance should the insulin be taken prior to the meal (Pre-bolusing)*
Nutritional information: 
This could be determined based on the photo of the meal with a vision model and connection to a nutritional database API or dataset. 
Blood glucose at time of eating meal: 
This could be either manually entered or retrieved through a CGM API integration. Because Dexcom’s API integration results in a 3 hour delay and I wanted to allow an entry point for days I don’t wear a CGM, I decided to allow the user to manually enter the blood glucose for the MVP.
Glycemic Index: 
This is where it gets tricky as there are not many datasets that have glycemic indexes readily available for individual food items; additionally, everyone’s rate of absorption will vary even if they eat the same food
So help give myself an idea about the glycemic index, I decided to use a form of a regression glucose model that could inform if this type of food typically spikes, stabilizes, or drops my blood glucose based on prior meal data.
Typical regression models return a forecasted numerical output that of a Y variable based on input variables. In this case, the output would be the predicted blood glucose value ~2 hours after eating a meal, with the input being the nutritional information, beginning blood glucose value, and time.
However, just telling a user that their blood sugar will be 168 after eating a certain meal isn’t valuable, in fact, it’s too granular; when calculating my insulin dosage, I just want to know in general if the food I’m eating will really spike my blood glucose or not.
•	X = inputs = factors that affect my blood glucose post meal (assuming a standard insulin dosage and no pre-bolus)
o	Nutritional information, blood glucose at meal time
So instead of displaying the raw numerical prediction, I decided to create UI labels based on numeric ranges:
•	SPIKE: If 2 hours post-meal glucose is 40+ mg/dL greater than mealtime glucose
•	DROP: If 2 hours post-meal glucose is less than 20 mg/dL than mealtime glucose
•	STEADY: If 2 hours post-meal glucose is within the range of “drop” and “spike” compared to mealtime glucose 
These labels would be displayed in the UI along with a blood glucose curve, allowing the user to understand glucose impact at a glance while still maintaining the precision of the model 
Insulin dosage timing: 
Rapid-acting insulin does not take effect at the time of injection. Instead, rapid-acting insulin begins its onset at 15 minutes and can take up to 60 min to become fully absorbed through the bloodstream lower blood glucose. 
I decided to exclude this factor in my MVP because this information is not easily accessible through an API like CGM data. Additionally, this information is not required to calculate the dosage amount, but rather is used to keep one’s blood glucose as stable at possible during and after a meal. 
How will the user get the information needed to inform their insulin dosage
A major pain point of most nutrition apps is needing to manually enter the dish name and ingredients to get the total nutrition information. Most apps are now mitigating by allowing users to simply take a photo of their food and using LLMs to identify what type of food and the nutritional information (or they have a connection to nutritional databases via APIs).
I knew I wanted a similar experience where a user can find the information they need with a simple snap of the picture. Instead of using an LLM, I ended up using a vision model comprised of FastSAM/CLIP with the LLM as a fallback only. Why I didn’t use an LLM for computer vision is further explored in this article. 
What happens if the model is wrong? 
Despite the technological advances in machine learning and artificial intelligence in the recent years, models are not perfect. They overfit, hallucinate, or simply insist that something is X and it’s really not. 
Because I am building application that relies on a model to help inform a health decision, especially one as critical as insulin dosage, I knew that I needed to allow the myself to update and edit the predicted outputs. 
If the predicted blood glucose impact is incorrect, then it’s less likely due to the glucose regression model, but more likely due to the output of the vision model. Why? Because the blood glucose regression model is calculated statistically on structured data while my vision model uses unstructured meal data to develop pattern recognition. The vision model incorrectly identifying dish components or portion would affect final post-meal glucose more than the regression model being a few numbers off. 
This means, that instead of correcting the blood glucose or nutritional data, I needed to allow myself to correct the actual dish composition and portion. Not only did I design SikFan to allow the user to edit the dish name, component list, and portion size, but I also chose to display the vision model’s confidence score to indicate to user if they needed to potentially correct the dish. 
Once a I correct a dish, then my glucose model should update based on the correctly identified dish composition and portion values.
Cool, I’m happy with the prediction, now what happens?
Well, the whole reason why I’m building is to build tools to provide a comprehensive picture, meaning I don’t want to understand how one dish affects me. Instead, I wanted to build a meal log so that I could quickly browse to understand how certain foods impact my blood glucose at the broader level.
Furthermore, SikFan fits my specific needs due to the models trained and built on my personal data. To prevent models from going stale, I needed to ensure that with each logged meal prediction, my vision model would improve and become better at recognizing what I was eating.  
I didn’t want to constantly update a dataset or hardcode rules for my vision model to recognize what I was eating; it had to be self-learning. 
The final user experience:
Once I developed my user experience and design, I could determine my model architecture based on the following requirements:
•	As a user, when I take a picture of my meal, I should be able to enter my current blood sugar manually, and then see a screen displaying my predicted blood glucose impact and nutritional breakdown of my dish
•	If I believe that the macros of my meal is incorrect, then I should be able to edit the composition of my meal or portion size at the ingredient level and see an updated glucose prediction
•	Once I’m satisfied with the predicted impact, I should then be able to log or record this meal so I identify patterns for future meals and understand how certain dishes affect my blood sugar  
•	With every dish, the models should become better at recognizing what I’m eating and grow more accurate at predicting how my blood glucose will be affected.
SikFan ended up using Gaussian Process Regression (GPR) model to predict glucose, layered on top of a vision model comprised of FastSAM/CLIP with an LLM fallback for food recognition. Stay tuned for another article diving deep into how I chose these models and more on when the LLM is used.
