// import { useState, useEffect } from 'react';
import Head from "next/head"; // allows us to add Head elements
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

function HomePage(props) {
  // props is set here which is props set up in getStaticProps (loads data before rendering), because of this, we no longer needs useState and useEffect
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

// a reserved name and is needed to be called this.
// nextjs finds it during pre-rendering process which is called first before it calls the component fn
// nextjs will wait for the promise to resolve/wait 'til data is loaded and then returns the props
// this will then load with the required data
// this is executed during build process, not on client-side
// getStaticProps - page will be faster because it can be cached and re-used
export async function getStaticProps() {
  // fetch data from API
  const client = await MongoClient.connect(
    "mongodb+srv://estradamce7:YlRwmwtJnSHMN2TA@cluster0.ksfae2h.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray(); // find all the documents in the collection convert to array

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(), // because mongodb stored id in '_id' and is an obj that we need to convert to string
      })),
    },
    revalidate: 1, // incremental static generation. with revalidate (takes a number) would be regenerated every x seconds if there are requests coming in, this then replaces the old generated pages. duration depends on data update frequency
  };
}

// // a reserved name. similar to getStaticProps
// // this function will not run during build process, but will always run on the server after deployment
// // any code written here will always run on the server, never in the client. so, server-side code can be run here
// // getServerSideProps - only use if if you need access to concrete request object because they cannot be accessed in getStaticProps. or if you have data that changes multiple times every second
// export async function getServerSideProps(context) { // contains requests and response
//   // we cam for example: fetch data from an API
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//     // no revalidate because it runs for every incoming request
//   }
// }

export default HomePage;
