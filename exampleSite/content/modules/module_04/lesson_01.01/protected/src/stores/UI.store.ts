import { buildingAppsNative } from "libs/BuildingAppsNative";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";
import { IRootStore } from "Store";

interface IBook {
  title: string,
  date: Date
}

export let createUIStore = (root: IRootStore) => {

  let persist = async () => {
    let plainState = toJS(store)
  
    buildingAppsNative.keychainWrite('state', JSON.stringify(plainState))
  }

  let hydrate = async () => {
    let stringState = await buildingAppsNative.keychainRead('state')

    if(stringState) {
      let parsedStore = JSON.parse(stringState)

      runInAction(() => {
        store.books = parsedStore.books.map((book: any) => ({
          title: book.title,
          date: new Date(book.date)
        }))
      })
    }
  }

//      _______.___________.  ______   .______       _______ 
//     /       |           | /  __  \  |   _  \     |   ____|
//    |   (----`---|  |----`|  |  |  | |  |_)  |    |  |__   
//     \   \       |  |     |  |  |  | |      /     |   __|  
// .----)   |      |  |     |  `--'  | |  |\  \----.|  |____ 
// |_______/       |__|      \______/  | _| `._____||_______|
                                                          
  let store = makeAutoObservable({
  // .______   .______        ______   .______    _______ .______     .___________. __   _______     _______.
  // |   _  \  |   _  \      /  __  \  |   _  \  |   ____||   _  \    |           ||  | |   ____|   /       |
  // |  |_)  | |  |_)  |    |  |  |  | |  |_)  | |  |__   |  |_)  |   `---|  |----`|  | |  |__     |   (----`
  // |   ___/  |      /     |  |  |  | |   ___/  |   __|  |      /        |  |     |  | |   __|     \   \    
  // |  |      |  |\  \----.|  `--'  | |  |      |  |____ |  |\  \----.   |  |     |  | |  |____.----)   |   
  // | _|      | _| `._____| \______/  | _|      |_______|| _| `._____|   |__|     |__| |_______|_______/    
                                                                                                        
    books: [] as IBook[],

  //   ______   ______   .___  ___. .______    __    __  .___________. _______  _______  
  //  /      | /  __  \  |   \/   | |   _  \  |  |  |  | |           ||   ____||       \ 
  // |  ,----'|  |  |  | |  \  /  | |  |_)  | |  |  |  | `---|  |----`|  |__   |  .--.  |
  // |  |     |  |  |  | |  |\/|  | |   ___/  |  |  |  |     |  |     |   __|  |  |  |  |
  // |  `----.|  `--'  | |  |  |  | |  |      |  `--'  |     |  |     |  |____ |  '--'  |
  //  \______| \______/  |__|  |__| | _|       \______/      |__|     |_______||_______/                                                                         

    get uppercasedBooks(): IBook[] {
      return store.books.map((book) => ({
        ...book,
        title: book.title.toUpperCase()
      }))
    },

    //      ___       ______ .___________. __    ______   .__   __.      _______.
    //     /   \     /      ||           ||  |  /  __  \  |  \ |  |     /       |
    //    /  ^  \   |  ,----'`---|  |----`|  | |  |  |  | |   \|  |    |   (----`
    //   /  /_\  \  |  |         |  |     |  | |  |  |  | |  . `  |     \   \    
    //  /  _____  \ |  `----.    |  |     |  | |  `--'  | |  |\   | .----)   |   
    // /__/     \__\ \______|    |__|     |__|  \______/  |__| \__| |_______/    
                                                                              
    async addBook(title: string) {
      const booksDto = await root.api.addBook(title)
      
      const books = booksDto.map((book: any) => ({
        title: book.title,
        date: new Date(book.date)
      }))

      if(books) {
        runInAction(() => {
          store.books = books
        })
      }
    },
    async fetchBooks() {
      const booksDto = await root.api.fetchBooks()

      const books = booksDto.map((book: any) => ({
        title: book.title,
        date: new Date(book.date)
      }))

      // clarify about observable arrays why you might need to do "replace"
      runInAction(() => {
        store.books = books
      })
    }

  });

  hydrate().then(() => {
    autorun(persist)
  })

  return store;
}