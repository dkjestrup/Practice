// Scheduling Problem

// Compare the meeting schedules and work hours of two people, and determine the available free slots
// for them to schedule a meeting with each other. Take the input in the format shown below, where
// times are listed as strings in the arrays: person A's meeting schedule, person A's work hours,
// person B's meeting schedule, person B's work hours. Input shown below:

const sampleInput = [
    [['9:00','10:30'],['12:00','13:00'],['16:00','18:00']],
    ['9:00','20:00'],
    [['10:00','11:30'],['12:30','14:30'],['14:30','15:00'],['16:00','17:00']],
    ['10:00','18:30']
];

// Give the output in the form of an array, containing sub arrays, with available meeting slots 
// held as strings in each sub array as shown below:

// Correct Output: [['11:30',12:00'],['15:00','16:00'],['18:00','18:30']

// Step One: turn input data into objects for the sake of clarity:

const strPersonA = {meetings: sampleInput.shift(),hours: sampleInput.shift()}
const strPersonB = {meetings: sampleInput.shift(),hours: sampleInput.shift()}

// Step Two: convert strings into numbers:

const personA = {meetings: listTimes(strPersonA.meetings.map(convertMeetings)),
                    hours:strPersonA.hours.map(getTime)}
const personB = {meetings: listTimes(strPersonB.meetings.map(convertMeetings)),
                    hours: strPersonB.hours.map(getTime)}

// Step Three: determine shared working hours: 

const crossover = getCrossover(personA.hours,personB.hours)

// Step Four: create a schedule of times that are valid for meetings:

const validSchedule = []

for (j=0;j<48;j++){
    if (validTime(j/2)){
        validSchedule.push(j/2)
    }
    
}

// Step Five: Remove redundant times in our schedule. For example, we don't 
// need 11:00, 11:30, 12:00. We only need the start and finish times of each
// available free time slot (11:00, 12:00 in this example)

const trimSchedule = []

trimSchedule.push(validSchedule[0])
for (k=1;k<((validSchedule.length)-1);k++){
    let a = (validSchedule[k-1])
    let b = (validSchedule[k])
    let c = (validSchedule[k+1])
    if ((c-a)!=1){
    trimSchedule.push(validSchedule[k])
    }
}
trimSchedule.push(validSchedule[validSchedule.length-1])

// Step Six: Convert our schedule to the correct output format, by turning
// the numbers back into strings, and arranging it in a multidimensional array.

const outputSchedule = []
const finalSchedule = []

outputSchedule.push(trimSchedule.map(strTime))

for (m=0;m<outputSchedule[0].length;m+=2){
    finalSchedule.push([outputSchedule[0][m],outputSchedule[0][m+1]])
}

// Tell the world about HACKERMAN:

console.log(finalSchedule)


//Converts a numerical time to a string of HH:MM
function strTime (time){
    let minutes = strMinutes(time)
    let hours = strHours(time)
    time = hours + ":" + minutes
    //console.log(time)
    return time
}

//Takes the minute fraction of a time and creates a string of MM
function strMinutes(time){
    let min = (time%1)*0.60
    let strmin1 = min.toFixed(2)
    let strmin = strmin1.slice(2)
    return strmin
}
//Takes the hours of a time and creates a string of HH
function strHours(time){
    let hours = Math.floor(time)
    let strHour = hours.toString()
    return strHour
}
//Checks if a given time is free on person A and person B's schedule
//and also checks if it falls within their shared working hours
function validTime (time){
    let a1 = testValue(time,personA.meetings)
    let a2 = testValue(time,personB.meetings)
    let b1 = (time >= crossover[0])
    let b2 = (time<=crossover[1])
    //console.log("a1:",a1)
    //console.log("a2:",a2)
    //console.log("b1:",b1)
    //console.log("b2:",b2)
    
    if ((a1&&a2)&&(b1&&b2)){
        return true 
    } else {
        return false
    }
}
//Checks if a given time is valid for a given list of meetings
function testValue (time,list){
    //adds time to the list it's being compared in and then sorts numerically
    list.push(time)
    list.sort(function(a,b){return a-b})
    
    //counts how many times in the list that time appears
    let count = 0
    for (let i = 0;i<list.length;i++){
        if (time === list[i]){
            count = count + 1
        }
    }

    //Any time may occur between 1-3 times in the list. The number of occurances
    //can be used to determine if it's a valid time for a meeting.

    //If it appears 3 times that means our chosen time falls in the middle of back-to-back meetings
    if (count === 3){
        //console.log(3)
        list.splice(list.indexOf(time),1)
        return false
    //If it appears 2 times that means it borders one meeting, which means it's a valid time
    } else if (count === 2){
        //console.log(2)
        list.splice(list.indexOf(time),1)
        return true
    //If it appears once then its position matters. If it is in an odd position in the list
    //then it is in the middle of another meeting. If even, then it's a free time.
    } else if (list.indexOf(time)%2 === 1){
        //console.log(list)
        //console.log("1 odd")
        list.splice(list.indexOf(time),1)
        return false
    } else {
        //console.log(list)
        //console.log("1 even")
        list.splice(list.indexOf(time),1)
        return true
    }
}

//Turns an array of meeting arrays into a list of values.
function listTimes (arrayMeetings){
    const listMeetings = []
    let i=0
    while (i<(arrayMeetings.length)){
        //console.log(arrayMeetings[0][0])
        listMeetings.push(arrayMeetings[i][0])
        listMeetings.push(arrayMeetings[i][1])
        i=i+1
    }
    //console.log("listMeetings: ",listMeetings)
    return listMeetings
}

//Finds common working hours, not valid for working days that cross over midnight.
function getCrossover (aHours,bHours){
    let crossover
    let crossover1
    let crossover2
    if ((aHours[1]-aHours[0])<(bHours[1]-aHours[0])){
        crossover1 = [aHours[0],aHours[1]]
        //console.log("crossover1: ",crossover1)
    }   else{
        crossover1 = [aHours[0],bHours[1]]
        //console.log("crossover1: ",crossover1)
    }
    if ((bHours[1]-bHours[0])<(aHours[1]-bHours[0])){
        crossover2 = [bHours[0],bHours[1]]
        //console.log("crossover2: ",crossover2)
    }   else{
        crossover2 = [bHours[0],aHours[1]]
        //console.log("crossover2: ",crossover2)
    }
    if ((crossover1[1]-crossover1[0])<=(crossover2[1]-crossover2[0])){
        crossover=crossover1
    }else{
        crossover=crossover2
    }
    return crossover
}

//Converts string time to numerical time
function getTime (time){
    let minutes = getMinutes(time)
    let hours = getHours(time)
    time = hours + minutes/60
    //console.log(time)
    return time
}
//Determines numerical minutes from a string of HH:MM
function getMinutes (time){
    let minutes
    minutes = +time.slice(time.length-2)
    //console.log(minutes)
    //console.log(typeof(minutes))
    return minutes
}
//Determines numerical hours from a string of HH:MM
function getHours (time){
    let hours
    let hoursDigits = time.indexOf(':')
    hours = +time.slice(0,hoursDigits)
    //console.log(hours)
    //console.log(typeof(hours))
    return hours
}

function convertMeetings (array){
    const time = array.map(getTime)
    return time
}