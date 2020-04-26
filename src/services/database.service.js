import Dexie from 'dexie'

const db = new Dexie('test')

db.version(1).stores({
    colors: '++id, name',
    days: 'date',
    tags: '++id,name',
    used_icons: '++id, code',
    action_tags: '++id, name'
});

db.on("populate", function() {
    // Init the DB
    // db.colors.add({name: 'red', code: '#ff0000'})
    // db.colors.add({name: 'green', code: '#00ff00'})
    // db.colors.add({name: 'blue', code: '#0000ff'})

    // db.days.add(
    //     {date:'2020-02-12', 
    //     color_id: 1, 
    //     actions:[
    //             {  id: 1,
    //                 color_id:2, 
    //                 description:'abc...xyz', 
    //                 icon:'mdi-bottle-soda-classic-outline'},
    //             {  id: 2,
    //                 color_id:2, 
    //                 description:'def...uvw', 
    //                 icon:'mdi-shuriken'}                    
    //             ], 
    //     tags:[]})
    // db.days.add({date:'2020-02-03', color_id: 1, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-04', color_id: 2, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-05', color_id: 1, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-06', color_id: 3, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-07', color_id: 2, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-08', color_id: 1, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-09', color_id: 2, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-10', color_id: 1, actions:[], tags:[], fav:0})
    // db.days.add({date:'2020-02-11', color_id: 3, actions:[], tags:[], fav:0})    
})

// TODO EN TEORIA DEBERIA SEPARARLO DE ESTE FICHERO O BIEN
// INCLUIRLO DENTRO DE LA CLASE Dexie
// DE MOMENTO LO HAGO ASI PARA IR PROGRESANDO
// Look for the tag in the database and add a new day
async function addTag(tag, date)
{
    let currentTag = await db.tags.get({name: tag.name})
    let tagaux
    if( typeof currentTag === 'undefined' ){
        tagaux = {name: tag.name, usedin: [date]}
    }
    else{
        // look for the date in the tag, if doesn't
        // exist, add it
        if (currentTag.usedin.indexOf(date) === -1) {
            currentTag.usedin.push(date)
        }
        tagaux = currentTag
    }
    tagaux.used = tagaux.usedin.length > 0
    let id = await db.tags.put(tagaux)
    return id
}

async function removeTag(tag, date)
{
    let currentTag = await db.tags.get(tag)
    // look for the date in the tag, and remove it
    let foundIndex = currentTag.usedin.findIndex( day  => day === date )
    if (foundIndex !== -1) {
        currentTag.usedin.splice(foundIndex, 1)
        currentTag.used = currentTag.usedin.length > 0
        await db.tags.put(currentTag)
    }
}

async function purgeTags()
{
    // delete those tags with no days assigned
    //  DO NOT MODIFY the value param or this function won't work
    await db.tags.toCollection().modify((value, ref) =>{
        if(value.usedin.length <= 0){
            delete ref.value
        }
    })
}

// save the day in the db and update the used_icons collection
async function saveDay(day)
{
    let selectedDay = await db.days.get(day.date)

    // remove old icons used in actions
    if( typeof selectedDay !== 'undefined' ){
        // remove the most used icons in this day
        let promises = selectedDay.actions.map( async a => {
            let i = await db.used_icons.get({code: a.icon})
            if( typeof i !== 'undefined'){
                let foundIndex = i.usedin.findIndex( date  => date === day.date )
                if (foundIndex !== -1) {
                    i.usedin.splice(foundIndex, 1)
                    // if the icon is not used in any day, I remove from the collection
                    // else, update the record in the collection
                    if(i.usedin.length <= 0){
                        db.used_icons.delete(i.id)
                    }
                    else{
                        await db.used_icons.put(i)
                    }
                }
            }
            return i
        })
        await Promise.all(promises)
        // remove the action tags
        let actionTagsArray = []
        selectedDay.actions.forEach( a => {
            const regx = /#[a-zA-Z0-9-_]+/g
            const arr = a.description.match(regx)
            if(arr != null){
                actionTagsArray = actionTagsArray.concat(arr)
            }
        })
        // /* eslint-disable no-console */
        // console.log(actionTagsArray)
        // /* eslint-enable no-console */
        if(actionTagsArray.length > 0){
            promises = actionTagsArray.map( async t => {
                let tag = await db.action_tags.get({name: t})
                if( typeof tag !== 'undefined'){
                    let foundIndex = tag.usedin.findIndex( date  => date === day.date )
                    if (foundIndex !== -1) {
                        tag.usedin.splice(foundIndex, 1)
                        // if the action tag is not used in any day, I remove from the collection
                        // else, update the record in the collection
                        if(tag.usedin.length <= 0){
                            db.action_tags.delete(tag.id)
                        }
                        else{
                            await db.action_tags.put(tag)
                        }
                    }
                }
                return tag
            })
            await Promise.all(promises)
        }
    }
    // add the used icons to the collection
    let promises = day.actions.map( async a => {
        let icon = await db.used_icons.get({code: a.icon})
        let iconaux
        if( typeof icon === 'undefined' ){
            iconaux = {code: a.icon, usedin: [day.date]}
        }
        else{
            icon.usedin.push(day.date)
            iconaux = icon
        }
        await db.used_icons.put(iconaux)        
        return icon
    })
    await Promise.all(promises)

    // add the used action tags to the collection
    let actionTagsArray = []
    day.actions.forEach( a => {
        const regx = /#[a-zA-Z0-9-_]+/g
        const arr = a.description.match(regx)
        if(arr != null){
            actionTagsArray = actionTagsArray.concat(arr)
        }
    })
    if(actionTagsArray.length > 0){
        let promises = actionTagsArray.map( async t => {
            let tag = await db.action_tags.get({name: t})
        /* eslint-disable no-console */
        console.log(tag)
        /* eslint-enable no-console */     

            let tagaux
            if( typeof tag === 'undefined' ){
                tagaux = {name: t, usedin: [day.date]}
            }
            else{
                tag.usedin.push(day.date)
                tagaux = tag
            }
            await db.action_tags.put(tagaux)        
            return tag
        })
        await Promise.all(promises)
    }
   
    await db.days.put(day)
}

export default db
export { addTag, removeTag, purgeTags, saveDay }


// // Open the database
// db.open().catch(function (e) {
//     console.error("Open failed: " + e);
// });
