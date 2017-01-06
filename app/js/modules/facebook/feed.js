/**
 * "feed": {
    "data": [
      {
        "message": "its the truth",
        "story": "Theresa Elisa at MultiMediaTechnology.",
        "created_time": "2017-01-04T09:21:50+0000",
        "id": "181533942181691_386066995061717"
      },
      {
        "message": "Koné Mösenbichler, Michael Eberherr, Bernadette Ke, Teresa Ke ... nextes moi nema uns bitte so gymnastik bälle mit an Urlaub!!!",
        "story": "Theresa Elisa shared People Are Awesome's video.",
        "created_time": "2016-12-19T19:02:09+0000",
        "id": "181533942181691_378946732440410"
      },
      {
        "message": "for the sake of clarity",
        "story": "Theresa Elisa updated her profile picture.",
        "created_time": "2016-11-15T22:46:11+0000",
        "id": "181533942181691_136514453350307"
      },
      {
        "message": "Da hab i ja was geiles versäumt. Damn. :D",
        "story": "Theresa Elisa shared music-news.at's post.",
        "created_time": "2016-11-12T11:48:13+0000",
        "id": "181533942181691_359714714363612"
      },
      {
        "message": "Juhu man kann täglich abstimmen :) nur 2klicks !!! Danke :) http://woobox.com/tm8678/gallery/hZ_mQaaT4rU",
        "created_time": "2016-11-11T09:54:57+0000",
        "id": "181533942181691_359191344415949"
      },
      {
        "message": "Hallo Freunde :D!
bitte für die Vicky und mich Voten! Des wär echt nett!",
        "created_time": "2016-11-10T19:22:34+0000",
        "id": "181533942181691_358883294446754"
      },
      {
        "message": "Where is my beer ? #goodtimes #fun #jellyshots #mates #helloween",
        "story": "Theresa Elisa with Christoph Mayr and 4 others.",
        "created_time": "2016-11-01T01:08:33+0000",
        "id": "181533942181691_353970861604664"
      },
      {
        "story": "Christina Taubinger shared a memory — with Laura Reiter and 4 others.",
        "created_time": "2016-10-25T05:25:33+0000",
        "id": "932176500145576_1379009082128980"
      },
      {
        "story": "Theresa Elisa shared a link.",
        "created_time": "2016-10-21T07:44:14+0000",
        "id": "181533942181691_347957185539365"
      },
      {
        "message": "I have an insane calling to be where I am not! ;) Pia Graeber",
        "story": "Theresa Elisa updated her cover photo.",
        "created_time": "2016-10-17T20:02:05+0000",
        "id": "181533942181691_250032361998515"
      },
      {
        "story": "Theresa Elisa updated her profile picture.",
        "created_time": "2016-10-15T21:30:47+0000",
        "id": "181533942181691_251960655139019"
      },
      {
        "story": "Theresa Elisa shared Laura Reiter's event.",
        "created_time": "2016-10-13T16:32:12+0000",
        "id": "181533942181691_343694469298970"
      },
      {
        "story": "Theresa Elisa shared a link.",
        "created_time": "2016-09-23T06:27:16+0000",
        "id": "181533942181691_334166443585106"
      },
      {
        "message": "Wähle das Ziel und liebe den Weg. - Helga Schäferling",
        "story": "Theresa Elisa updated her cover photo.",
        "created_time": "2016-09-20T08:54:10+0000",
        "id": "181533942181691_332675483734202"
      },
      {
        "story": "Theresa Elisa shared Matzebub's post.",
        "created_time": "2016-09-16T18:51:56+0000",
        "id": "181533942181691_331043023897448"
      },
      {
        "message": "#vomsalatschrumpftderbizeps",
        "story": "Theresa Elisa with Sandra Schuster at Leidseplein - Amsterdam Centrum.",
        "created_time": "2016-09-16T18:45:45+0000",
        "id": "181533942181691_331041670564250"
      },
      {
        "story": "Theresa Elisa shared MultiMediaTechnology's post.",
        "created_time": "2016-09-16T10:29:22+0000",
        "id": "181533942181691_330872323914518"
      },
      {
        "message": "We exist.",
        "story": "Theresa Elisa with Sandra Schuster at Holland, Amsterdam.",
        "created_time": "2016-09-14T22:50:41+0000",
        "id": "181533942181691_330235737311510"
      },
 */

'use strict';

import config from 'config';
import Collection from 'core/collection';
import Post from 'facebook/post';

module.exports = Collection.extend({
    model: Post,

    accessToken: null,

    reqDataType: 'jsonp',

    initialize(accessToken) {
        this.accessToken = accessToken;
    },

    url() {
        return config.get('Client.providers.facebook.api') + '/me?fields=feed.limit(500)&access_token=' + this.accessToken;
    },

    parse(data) {
        if (!data.feed) return {};

        let feedArr = [];

        for (let post of data.feed.data) {

            let feedData = {
                id: post.id,
                created_time: post.created_time,
                message: post.message,
                story: post.story
            };

           feedArr.push(new Post(feedData));
        }

        return feedArr;
    },

    getHashTags() {
        let hashTagsCountMapping = {};

        for (let post of this.models) {
            for (let hashtag of post.getHashTags()) {
                if (!hashTagsCountMapping[hashtag.toLowerCase()]) {
                    hashTagsCountMapping[hashtag.toLowerCase()] = {
                        name: hashtag,
                        count: 1
                    };
                }
                else {
                    hashTagsCountMapping[hashtag.toLowerCase()].count++;
                }
            }
        }

        return Object.values(hashTagsCountMapping);
    },

    getActivities() {
        let activities = [];

        for (let post of this.models) {

            let activity = {
                id: post.id,
                type: 'post',
                created_time: post.getCreateDate(),
                provider: 'facebook'
            };

            activities.push(activity);
        }

        return activities;
    }
});
