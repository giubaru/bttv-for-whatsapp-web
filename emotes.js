/*
  Based on https://github.com/mdn/webextensions-examples/tree/master/emoji-substitution
*/

const TWITCH_ID = '90075649';

let emotesEndpoints = [
  `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${TWITCH_ID}`,
  `https://api.betterttv.net/3/cached/users/twitch/${TWITCH_ID}`,
  'https://api.betterttv.net/3/users/5ff8d0610a24220c8e1d86da',
  'https://api.betterttv.net/3/cached/emotes/global',
  'https://api.betterttv.net/3/cached/users/twitch/31400525' // supinic emotes
]

let tmpEmotes = new Map();

const CDN_EMOTES = 'https://cdn.betterttv.net/emote';

function parse_emote(emote){
  let emote_url = `${CDN_EMOTES}/${emote.id}/1x`;
  if(emote.images){
    emote_url = emote.images['1x'];
  }
  tmpEmotes.set(emote.code, emote_url);
}

emotesEndpoints.forEach(
  function(endpoint) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint);
    xhr.send();
    xhr.onload = function() {
      const bttv = JSON.parse(this.response);
      if(bttv.channelEmotes) {
        Array.from(bttv.channelEmotes, emote => parse_emote(emote));
        Array.from(bttv.sharedEmotes, emote => parse_emote(emote));
      } else {
        Array.from(bttv, emote => parse_emote(emote));
      }
    }
  }
)


