module.exports = {
    1: {
        title:"Riyadh: Pedestrian vs. Car",
        team:"Dennis Harvey, MCP’17, Brandon Peterson, MCP’17",
        text1:"Riyadh is a city with both enormous amounts of traffic congestion and vast possibilities for pedestrian-focused urban design. Its ongoing public transportation development suggests a city invested in improving its walkability, while its current pedestrian zones are showcasing their successes with high amounts of social activity. Where can traffic calming measures and street pedestrianization have the highest impacts in Riyadh, and how can data visualization help find these opportunities?",
        text2:"Using Twitter data as a proxy for potential pedestrian activity, mapped against car congestion data for Riyahd’s many highways and city streets, Pedestrian vs. Car visualizes densities of tweets versus densities of traffic in order to find zones of separation and overlap.",

    },
    2: {
        title:"Riyadh: Women on the Move",
        team:"Sin Bin Tan, MCP’17, Elaine Kim, MCP’17, Cortni Kerr, MCP’17",
        text1:"In Saudi Arabia, women are not allowed to drive. Instead they rely on personal drivers to get around the city. A public transport system could have a tremendous impact on the mobility of women. Riyadh, the Saudi Arabia’s capital city, is currently building an extensive metro system, scheduled to be completed in 2018. The Women on the Move project seeks to understand the movements of women in Riyadh, and analyze how the proposed rail system will serve the places they travel.",
        text2:"The project created a sample population utilizing call detail records with origins and destinations at an all-women’s university. This analysis identifies where women travel before or after going to campus, potential paths, and the hotspots not served by the proposed rail system.",

    },
    3: {
        title:"Riyadh GO",
        team:"Waishan Qiu, MCP’17, Xu Zhang, M.Arch’17",
        text1:"Riyadh GO is a comprehensive visualization of your real-world travelling cost in terms of Money and Time from Riyadh hotspots. You can explore how far can you travel by Uber given a time and monetary constrain.",
        text2:"The collected Foursquare check-in data of Riyadh is visualized with their node size and color-code based on the relative importance according to social activity, defining urban hotspots. The transportation OD analysis data and congestion simulation data obtained from MIT’s HuMNet LAB is used to visualize the time-travel cost. The Uber cost estimation algorithm is implemented to assess the trip monetary cost -a combination of time and distance.",
    },
    4: {
        title:"Migrant Population and Transportation",
        team:"Sergio Galaz Garcia, M.Arch’17, Weiqian Liu, M.Arch’16",
        text1:"Current estimates suggest that a third of Riyadh’s inhabitants are migrants. This community is inserted unevenly in Riyadh’s daily life: residentially, it tends to concentrate in the central aras, and labor wise, it tends to be largely concentrated in private enterprises --in fact, it represents 90% of the total workforce of this sector. Due to these characteristics, visualizing the way Riyadh’s migrant population relates to the city’s overall transportation workflows is significant, first, as it allows to understand transportation patterns of a significant size of the Saudi’s capital population; second, as a first way of understanding changes in transportation patterns that may ensue due to the forecasted entry of more Saudi people into the private economy, and third, as a way of understanding how integrated or fragmented gated Riyadh is as a urban unit composed of Migrant and Saudi people.",
        text2:"Two visual outputs were produced to visualize transportations from a migratory status perspective: one entailed the production of a choropleth map allowing for a rapid visualization of the different proportion of migrant population that Riyadh’s Transportation Area Zones feature, and another was related to the generation of an arc map that would show the mobility relationships between a particular target TAZ and all the others. The project allowed the user to select this target TAZ by clicking on a particular zone in the choropleth map.",
    },
    5: {
        title:"Riyadh Together: Shared Mobility",
        team:"Jon Cambell, MCP’16, Corinna Li, MCP’16",
        text1:"RiyadhTOGETHER explores the potential of sharing taxi or ride-hail trips as a first-/last-mile solution for Riyadh’s upcoming public transportation system. While the planned subway and bus routes cover major corridors, it can still take up to 25 minutes to walk to the nearest stop/station. Accessibility to public transport stops and stations is especially crucial for Riyadh, given the hot climate, insufficient infrastructure for walking and biking, and the cultural preference towards driving.",
        text2:"As Riyadh’s public transport system is still in construction, we conduct the exercise based on a city with existing public transport network, stations, and publically-available taxi trip data. We use New York City as a jumping board, with aims to develop tools and methods that can be applied to Riyadh. We used a week of taxi trips data from the NYC Taxi & Limo Commission for trips beginning or ending at Flushing-Main St Station on the 7 Train. Each record contains location and time of that trip’s pick-up and drop-off. We developed an algorithm to match potentially sharable trips using the Google Maps Directions API to determine trip routing. Trips are considered sharable if delay due to sharing is less than ten minutes for each passenger. After determining all possible shared trips, we apply a maximum matching algorithm to determine the sharing scenario with the most possible shared trips.",
    },
    6: {
        title:"Voices of Riyadh",
        team:"Scott Margeson, MCP’17, Luke Mich, MCP’17",
        text1:"Planning a new transit system requires an understanding of current travel behaviors and needs, but surveys and field observations don’t always uncover the whole story. Is there a way we can mine the data that people are constantly sharing? Can social media tell us anything about how people are moving around the city? Our web tool, entitled “Voices of Riyadh,” aims to distill travel trends by parsing Twitter for both content and user infor-mation and mapping that data both spatially and temporally.",
        text2:"We began by categorizing tweets by content and user type. We then mapped this data over space and time, allowing users to view trends throughout the week and locate those trends within the city.",

    },
};