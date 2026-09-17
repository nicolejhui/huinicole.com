What is the goal of SikFan:
Ultimately, my goal as a type 1 diabetic is to lower my A1C and increase my time-in-rage. A1C is the average blood glucose over the past 2-3 months and time-in-range refers the time spent within a specified glucose range (the standard being 70 – 180 mg/dL). Many diabetics also observe time-in-range because A1C provides a singular average while time-in-range is an indicator of how stable one’s blood glucose is.  
For example, I could have a 6.5 A1C buy experience frequent hyperglycemia and hypoglycemia, resulting in a “rollercoaster” on the graph. Whereas if I spent a day with 80% time-in-range it meant my blood glucose stayed between 70 – 180 mg/dL for 80% of the day. Maintaining a high time-in-range prevents diabetics from experiencing a list of hyper/hypoglycemia symptoms the length of a disclaimer at the end of a medication commercial. For context, symptoms can include (but are not limited to) dehydration, irritable mood, frequent urination, body fatigue and shakiness, and more. Yikes, right? 
A1C requires a blood test while wearable companies like Dexcom have done an awesome job of showing average time-in-range within their mobile apps. To measure the effectiveness of SikFan, I will compare my average time-in-range before and after one month of using SikFan
•	Primary metric:  average time-in-range over a one-month period of using SikFan
•	Secondary metric:  average blood glucose over a one-month period of using SikFan
Defining the User Experience:
Who is the user? 
Me, duh! If you want to read why I’m building this, check out my intro article! 
I’m a type 1 diabetic who typically eats food of the East Asian cuisine. The handful of recorded East Asian dishes in nutritional databases tend to be restaurant food that I don’t eat on a daily basis. Instead, my typical meal is composed of multi-grain rice with 2-3 other components (typically a protein and multiple vegetables). 
For diabetic medical devices, I utilize a CGM and insulin pump but, this app should still be usable on days where I’m only relying on finger pricking and manual injections.
What does the user need to inform their insulin dosage: 
In order to inform how much insulin to take, I typically consider the following factors:
1.	The amount of carbohydrates, fat, and fiber in a meal that will be consumed
2.	Their blood glucose at that moment
3.	The general glycemic index of the ingredients in the dish, which determines how fast glucose is absorbed by the bloodstream
4.	How far in advance should the insulin be taken prior to the meal (Pre-bolusing)*
Nutritional information: 
Nutritional information could be determined based on the photo of the meal with a vision model and connection to a nutritional database API or dataset. 
Blood glucose at time of eating meal: 
Blood glucose should be either manually entered or retrieved through a CGM API integration. Because Dexcom’s API integration is not completely live, having a 1-3 hour delay for historical glucose values, I made the decision to forgo this integration in my MVP and rely on allowing the user to enter manually enter blood glucose.
Glycemic Index: 
This is where it gets insulin dosage gets complicated. Glycemic index is not required to calculate the dosage amount, but, knowing the glycemic index helps inform the timing of the dose. 
The difficulty with including this decision point is that there are not many datasets that have glycemic indexes readily available for individual food items. Additionally, everyone’s rate of absorption will vary even if they eat the same food
So, to give myself an idea about the glycemic index, I decided to use some sort of regression glucose model that could inform if a dish typically spikes, stabilizes, or drops my blood glucose based on prior meal data.
Typical regression models return a forecasted numerical output that of a Y variable based on input variables. In this case, the output would be the predicted blood glucose value ~2 hours after eating a meal, with the input being the nutritional information, beginning blood glucose value, and time.
However, just telling a user that their blood sugar will be 168 after eating a certain meal isn’t valuable, in fact, it’s too granular; when calculating my insulin dosage, I just want to know in general if the food I’m eating will rapidly spike my blood glucose or not.
•	X = inputs = factors that affect my blood glucose post meal (assuming a standard insulin dosage and no pre-bolus)
•	Y = output = my blood glucose 2 hours after a meal
So instead of displaying the raw numerical prediction, I decided to create UI labels based on numeric ranges:
•	SPIKE: If 2 hours post-meal glucose is 40+ mg/dL greater than mealtime glucose
•	DROP: If 2 hours post-meal glucose is less than 20 mg/dL than mealtime glucose
•	STEADY: If 2 hours post-meal glucose is within the range of “drop” and “spike” compared to mealtime glucose 
These labels would be displayed in the UI along with a blood glucose curve, allowing the user to understand glucose impact at a glance while still maintaining the precision of the model 
Insulin dosage timing: 
The timing of the insulin dose matters because rapid-acting insulin does not take actually effect at the time of injection. Instead, rapid-acting insulin begins its onset at 15 minutes and can take up to 60 min to become fully absorbed through the bloodstream lower blood glucose. 
I decided to exclude this factor in my MVP because this information is not easily accessible through an API like CGM data; there is no real-time service that exists where I could poll to retrieve data from my insulin pump. 
Additionally, similar to glycemic index, this information is actually not required to calculate the dosage amount, but is rather used to keep one’s blood glucose as stable at possible during and after a meal. 
How will the user get the information needed to inform their insulin dosage
A major pain point of most nutrition apps is needing to manually enter the dish name and ingredients to get the total nutrition information. Most apps currently mitigate this by allowing users to take a photo of their food and using LLMs to identify what type of food and the nutritional information.
I wanted to create a similar experience to reduce the burden of manual entry on the consumer side. Instead of using an LLM, I ended up using a vision model comprised of FastSAM/CLIP with the LLM as a fallback only. 
Why? LLMs are built on the same data that lack knowledge of East Asian dishes and ingredients. Additionally, the amount of calls I’d have to make to an LLM with each dish would result in high latency costs. LLMs are, however, great for filling in the gaps where typical classic vision models fail due to the larger dataset they are trained on. Knowing a vision model wouldn’t be 100% accurate, I included an integration with Anthropic’s API to act as a failsafe for dish corrections.
Why I didn’t use an LLM for computer vision and where the LLM is actually used will be further explored in a future article. 
What happens if the model is wrong? 
Despite the technological advances in machine learning and artificial intelligence in the recent years, models are not perfect. They overfit, hallucinate, or simply insist that something is X and it’s really not. 
Because I am building application that relies on a model to help inform a health decision, especially one as critical as insulin dosage, I needed to allow the user to update and edit the predicted outputs. 
If the predicted blood glucose impact is incorrect, then it’s less likely due to the glucose regression model, but more likely due to the output of the vision model. Why? Because the blood glucose regression model is calculated statistically on structured data while my vision model uses unstructured meal data to develop pattern recognition. Incorrectly identified dish components or portion amounts affect the final glucose impact more than the regression model deviating from a few numbers. 
This means, that instead of correcting the blood glucose or nutritional data, I needed to allow the user to correct the actual dish composition and portion. Not only did I design SikFan to allow the user to edit the dish name, component list, and portion size, but I also chose to display the vision model’s confidence score to indicate to user if they needed to potentially correct the dish. 
Once a dish is corrected, then my glucose model updates based on the correctly identified dish composition and portion values. These corrections would then be saved so both my vision model and glucose model could continually improve without any brittle, hardcoded datasets or rules.
Cool, I’m happy with the prediction, now what happens?
The whole reason why I’m building is to create to provide a comprehensive picture of my health, my goal isn’t to only understand how one dish affected me in a single point of time. Therefore, I built a meal log so I can quickly reference previous meals and understand how they impact my blood glucose at a glance. Once I have enough meal logs post-MVP, my next enhancement will be working on building insights to display in the “Trends” section to help me better understand the how certain foods affect my blood sugar on the broader level.
Furthermore, SikFan was built to fit my specific needs because the models are trained and built on my personal data. Storing logged meals with their predicted results and true post-meal glucose would also prevent my models from going stale and allow them to draw from a broader, personalized set of data.
The final user experience:
Once I developed my user experience and design, I could determine my model architecture based on the following requirements:
•	As a user, when I take a picture of my meal, I should be able to enter my current blood sugar manually, and then see a screen displaying my predicted blood glucose impact and nutritional breakdown of my dish
•	If I believe that the macros of my meal is incorrect, then I should be able to edit the composition of my meal or portion size at the ingredient level and see an updated glucose prediction
•	Once I’m satisfied with the predicted impact, I should then be able to log or record this meal so I identify patterns for future meals and understand how certain dishes affect my blood sugar  
•	With every dish, the models should become better at recognizing what I’m eating and grow more accurate at predicting how my blood glucose will be affected.
SikFan ended up using Gaussian Process Regression (GPR) model to predict glucose, layered on top of a vision model comprised of FastSAM/CLIP with an LLM fallback for food recognition. 
Stay tuned for another article diving deep into how I chose these models and more on when the LLM is used.
