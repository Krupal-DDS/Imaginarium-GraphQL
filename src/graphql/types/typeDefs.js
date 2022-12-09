const { gql } = require("apollo-server");

const typeDefs = gql`
 scalar Upload
    type User {
        id:ID!
        username:String!
        email:String!
        password:String!
        authToken:String
        verify:Boolean      
        langauage:String
        image:String
        firstname:String                
    }  
    type Feedback {
        user:String
        type:String
        question:String
        description:String
    } 
    type Auth{
        oldpassword:String
        conpassword:String
    }
    type Otp {
        otp:String
    } 
    type Logline {
        incitingIncident:String
        protagonist:String
        action:String
        antagonist:String
    } 
    type Actor {
        actorId:ID
        actorname:String
        heroname:String
        actorDescription:String
        actorImage:String
    }
    type Genres { 
        Comedy:[String]
        Thriller:[String]
        Action:[String]
        Mystery:[String]
        Adventure:[String]
        Animation:[String]
        History:[String]
        SciFi:[String]
        Romance:[String]
        Drama:[String]
        Fantasy:[String]
        Crime:[String]
        Biography:[String]
        Family:[String]
        Horror:[String]
    }
    type SimilarMovie {
        moviebanner:String
        moviename:String
    } 
    type Act {
        actId:ID
        actName: String
        Scenes:[Scene]
    }
    type Scene {
        sceneId:ID
        sceneName:String
        description:String
        actors:[Actor]
    }  
    type Movie {
        movieId:ID
        moviebanner:String!
        title:String!
        type:String!
        logline:Logline
        tagline:String
        synopsis:String
        actors:[Actor]
        author:String
        tags:[String]
        genres:[Genres]
        similarmovies:[SimilarMovie]
        screenplay:[Act]
    } 
    input LoglineInput {
        incitingIncident:String
        protagonist:String
        action:String
        antagonist:String
    } 
    input ActorInput {
        actorname:String
        heroname:String
        actorDescription:String
        actorImage:String
    }
    input GenresInput { 
        Comedy:[String]
        Thriller:[String]
        Action:[String]
        Mystery:[String]
        Adventure:[String]
        Animation:[String]
        History:[String]
        SciFi:[String]
        Romance:[String]
        Drama:[String]
        Fantasy:[String]
        Crime:[String]
        Biography:[String]
        Family:[String]
        Horror:[String]
    }
    input SimilarMovieInput {
        moviebanner:String
        moviename:String
    } 
    input ActInput {
        actName: String
        Scenes:[SceneInput]
    }
    input SceneInput {
        sceneName:String
        description:String
        actors:[ActorInput]
    } 


    type Writer {
        writerId:ID
        writername:String
        writerDescription:String
    }
    type SimilarBook {
        bookbanner:String
        bookname:String
    } 
    type BookAct {
        actId:ID
        actName: String
        chapters:[Chapter]
    }
    type Chapter {
        chapterId:ID
        chapterName:String
        description:String
        writers:[Writer]
    } 
    type Book {
        bookId:ID
        bookbanner:String!
        title:String!
        type:String!
        logline:Logline
        tagline:String
        synopsis:String
        writers:[Writer]
        author:String
        tags:[String]
        genres:[Genres]
        similarBooks:[SimilarBook]
        manuscript:[BookAct]
    } 
    input WriterInput {
        writername:String
        writerDescription:String
    }
    input SimilarBookInput {
        bookbanner:String
        bookname:String
    } 
    input BookActInput {
        actName: String
        chapters:[ChapterInput]
    }
    input ChapterInput {
        chapterName:String
        description:String
        writers:[WriterInput]
    } 


    type Season {
        seasonId:ID
        seasonName:String
        seasonDescription:String
        Episodes:[Episode]
    }
    type Episode {
        episodeId:ID        
        episodeName:String,
        Acts:[Act]
    }
    type SimilarSeries {
        seriesbanner:String
        seriesname:String
    } 

    type Series {
        seriesId:ID
        seriesbanner:String!
        title:String!
        type:String!
        logline:Logline
        tagline:String
        synopsis:String
        actors:[Actor]
        author:String
        tags:[String]
        genres:[Genres]
        similarseries:[SimilarSeries]
        screenplay:[Season]
    } 
    
    input SeasonInput {
        seasonId:ID
        seasonName:String
        seasonDescription:String
        Episodes:[EpisodeInput]
    }
    input EpisodeInput {
        episodeId:ID        
        episodeName:String,
        Acts:[ActInput]
    }
    input SimilarSeriesInput {
        seriesbanner:String
        seriesname:String
    }
    
    type TrackTime{
        totalTime:String,
        date:String
    }
    type Time {
        user:String!,
        userTime:[TrackTime]
        time:String
    }
    input TrackTimeInput{
        totalTime:String,
        date:String
    }
    
    

    type Query {
        getUser: [User!]
        logout(email:String!): [User!]

        getMovie(movieId:ID): [Movie]
        deleteActor(movieId:ID,actorId:ID):Movie 
        deleteSceneActor(movieId:ID,actId:ID,sceneId:ID,actorId:ID):Act
        getAuthorMovies(author:String):[Movie]
        
        getBook(bookId:ID!):Book
        deleteWriter(bookId:ID!,writerId:ID!):Writer
        deleteChapterWriter(bookId:ID!,actId:ID!,chapterId:ID!,writerId:ID!):BookAct
        getAuthorBooks(author:ID!):[Book]
        deleteBookAct(bookId:ID!,actId:ID!):Book
        deleteBookChapter(bookId:ID!,actId:ID!,chapterId:ID!):Book
        
        getSeries(seriesId:ID!):Series
        deleteSeriesActor(seriesId:ID!,actorId:ID!):Series 
        deleleSeriesSceneActor(seriesId:ID!,seasonId:ID!,episodeId:ID!,actId:ID!,sceneId:ID!,actorId:ID!):Season
        getAuthorSeries(author:String!):[Series]
        deleteSeason(seriesId:ID!,seasonId:ID!):Series
        
        getTime(user:String!):Time
        


    }
     type Mutation {
        signUp(username:String!,email:String!,password:String!,conpassword:String!):User
        verifyUser(email:String,otp:String):Boolean
        signIn(email:String!,password:String!):User
        forgotPasswordOtp(email:String):Boolean
        verifyOtp(email:String,otp:String,password:String,conpassword:String):Boolean
        signUpbyGoogle(email:String):User
        signUpbyApple(email:String):User
        langauage(id:ID,langauage:String):Boolean
        editProfile(file: Upload,email:String,firstname:String,username:String,password:String,conpassword:String,oldpassword:String): User
        feedback(user:String,type:String,question:String,description:String):Feedback

        addNewMovie(type:String!,moviebanner:String!,title:String!,tagline:String,synopsis:String,logline:LoglineInput,genres:[GenresInput],tags:[String],actors:[ActorInput],similarmovies:[SimilarMovieInput],author:String,screenplay:[ActInput]):Movie
        addNewActor(actorname:String,heroname:String,actorDescription:String,actorImage:String):Actor
        updateMovie(movieId:ID!,moviebanner:String!,title:String!,tagline:String,synopsis:String,logline:LoglineInput,genres:[GenresInput],tags:[String],actors:[ActorInput],similarmovies:[SimilarMovieInput]):Movie
        updateScene(movieId:ID!,actId:ID!,sceneId:ID!,sceneName:String,description:String,actors:[ActorInput]):Act
        updateSceneActor(movieId:ID,actId:ID,sceneId:ID,actorId:ID,actors:[ActorInput]):Act

        addNewBook(bookbanner:String!,title:String!,type:String!,logline:LoglineInput,tagline:String,synopsis:String,writers:[WriterInput],author:String,tags:[String],genres:[GenresInput],similarBooks:[SimilarBookInput],manuscript:[BookActInput]):Book
        addNewWriter(writername:String,writerDescription:String):Writer
        addNewAct(bookId:ID!):Book
        updateBook(bookId:ID!,bookbanner:String!,title:String!,tagline:String,synopsis:String,logline:LoglineInput,genres:[GenresInput],tags:[String],writers:[WriterInput],similarBooks:[SimilarBookInput]):Book
        updateChapter(bookId:ID!,actId:ID!,chapterId:ID!,chapterName:String,description:String,writers:[WriterInput]):BookAct
        updateChapterWriter(bookId:String,actId:ID!,chapterId:ID!,writerId:String!,writers:[WriterInput]):BookAct

        addNewSeries(seriesbanner:String!,title:String!,type:String!,logline:LoglineInput,tagline:String,synopsis:String,actors:[ActorInput],author:String,tags:[String],genres:[GenresInput],similarseries:[SimilarSeriesInput],screenplay:[SeasonInput]):Series
        addNewSeriesActor(actorname:String,heroname:String,actorDescription:String,actorImage:String):Actor
        addNewSeason(seriesId:ID!,season:SeasonInput):Series
        addNewSeriesEpisode(seriesId:ID!,seasonId:ID!,episodeName:String):Season
        updateSeries(seriesId:ID!,seriesbanner:String!,title:String!,logline:LoglineInput,tagline:String,synopsis:String,actors:[ActorInput],tags:[String],genres:[GenresInput],similarseries:[SimilarSeriesInput]):Series
        updateSeriesScene(seriesId:ID!,seasonId:ID!,episodeId:ID!,actId:ID!,sceneId:ID!,scene:SceneInput):Season
        updateSeriesSceneActor(seriesId:ID!,seasonId:ID!,episodeId:ID!,actId:ID!,sceneId:ID!,actorId:ID!,actors:ActorInput):Season

        addTrackTime(user:String!,totalTime:String!):Time
        
        
        

    }
`

module.exports = { typeDefs }  