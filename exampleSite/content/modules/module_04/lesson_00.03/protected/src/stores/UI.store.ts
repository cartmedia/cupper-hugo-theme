import { makeAutoObservable, runInAction } from "mobx";
import { IRootStore } from "Store";

interface IBook {
  title: string,
  date: Date
}

export let createUIStore = (root: IRootStore) => {

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

  return store;
}