import Head from 'next/head';
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetUpDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta
          name="description"
          content={props.meetupData.description}
        />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

// getStaticPaths is a fn we need to export in a page component file if it's a dynamic page & if you're using getStaticProps
export async function getStaticPaths() {
  // fetch API data
  const client = await MongoClient.connect(
    "mongodb+srv://estradamce7:YlRwmwtJnSHMN2TA@cluster0.ksfae2h.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); // .find - 1st arg is filter obj (this case get all), 2nd arg define which fields to extract for each doc (this case, we only need _id: 1 - only include _id and no other values)

  client.close();

  // returns an obj where we describe all the dynamic segment values. in this case, all meetupIds
  return {
    fallback: 'blocking', // this key tells nextjs whether paths array contains all supported parameter values or only some; false - paths contains all supported meetupId values, true - nextjs will try to generate a page for this meetupId dynamically
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
  // when fallback is set to true or 'blocking' we are telling NextJS that the paths specified here might not be exhausted, NextJS will not respond with 404 but will generate the page on-demand and cache it.
  // true - will return an empty page and pull down dynamically generate page once done
  // 'blocking' user will not see anything until the page was pre-generated and the finished page will be served
}

// we cannot use React hooks here
export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId; // since we are fetching by meetupId, we can get by params

  const client = await MongoClient.connect(
    "mongodb+srv://estradamce7:YlRwmwtJnSHMN2TA@cluster0.ksfae2h.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({  // findOne finds a single document. we are referencing _id and meetupId we got from context.params.meetupId
    _id: new ObjectId(meetupId),
  });

  console.log(selectedMeetup);

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetUpDetails;
