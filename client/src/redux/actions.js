export const toggleModal = (display) => ({
    type: 'MODAL',
    display
})

export const addCollection = (collectionName) => ({
    type: 'ADD_COLLECTION',
    collectionName
})

export const deleteCollection = (collectionName) => ({
    type: 'DELETE_COLLECTION',
    collectionName
})