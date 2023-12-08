const checkMillionDollarIdea = (numWeeks, weeklyRevenue) => {
    const totalValue = numWeeks * weeklyRevenue;
    const millionDollarIdea = (totalValue < 1000000) ? false : true;
    
    return millionDollarIdea;
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
