import { DataFrame } from "pandas-js";

// HTML div headers for each element
const TIMESTAMP = '<div class="pull_right date details" title="';
const SENDER = '<div class="from_name">\n';
const FWD_MSG = '<div class="forwarded body">\n';
const FWD_SENDER = '<span class="details">';
const MESSAGE = '<div class="text">\n';
const MEDIA = '<div class="title bold">\n';
const MEDIA_PHOTO = '<img class="photo"';
const MEDIA_VIDEO = '<img class="video_file"';
const REPLY = '<div class="reply_to details">\n';
const CONTACT_CARD = '<div class="status details">\n';
const POLL = '<div class="question bold">\n';

// Identifiers for the element types
const MEDIA_TAG = "<media>\n";
const MEDIA_PHOTO_TAG = "<media_photo>\n";
const MEDIA_VIDEO_TAG = "<media_video>\n";
const MEDIA_STICKER_TAG = "<media_sticker>\n";
const MESSAGE_TAG = "<msg>\n";
const NOFWD_TAG = "<nfwd>\n";
const CONTACT_CARD_TAG = "<contact_card>\n";
const POLL_TAG = "<poll>\n";

class Analyzer {
  constructor(contentString) {
    this.contentsString = contentString;
    this.startDate = null;
    this.endDate = null;
    /////////////////////////METRICS (SENDER ONE)/////////////////////////
    this.sOne = null;
    this.dfOne = null;
    this.sOneMsgCount = null;
    this.sOneWordCount = null;
    this.sOneWPMCount = null;
    this.sOnePhotoCount = null;
    this.sOneVideoCount = null;
    this.sOneStickerCount = null;
    this.sOneMsgComment = null;
    this.sOneWordComment = null;
    this.sOneWPMComment = null;
    this.sOnePhotoComment = null;
    this.sOneVideoComment = null;
    this.sOneStickerComment = null;
    this.sOneAverageRTComment = null;
    this.sOneDatetimes = null;
    this.sOneTimings = null;
    this.sOneAverageRT = null;

    /////////////////////////METRICS (SENDER TWO)/////////////////////////
    this.sTwo = null;
    this.dfTwo = null;
    this.sTwoMsgCount = null;
    this.sTwoWordCount = null;
    this.sTwoWPMCount = null;
    this.sTwoPhotoCount = null;
    this.sTwoVideoCount = null;
    this.sTwoStickerCount = null;
    this.sTwoMsgComment = null;
    this.sTwoWordComment = null;
    this.sTwoWPMComment = null;
    this.sTwoPhotoComment = null;
    this.sTwoVideoComment = null;
    this.sTwoStickerComment = null;
    this.sTwoAverageRTComment = null;
    this.sTwoDatetimes = null;
    this.sTwoTimings = null;
    this.sTwoAverageRT = null;
  }

  startPipeline = () => {
    // GENERATE THE LIST OF RAW STRINGS
    const linesRaw = this.createLinesRaw(this.contentsString);
    const linesProcessedOne = this.createLinesProcessedOne(linesRaw);
    const linesProcessedTwo = this.createLinesProcessedTwo(linesProcessedOne);
    const linesFinished = this.createLinesFinished(linesProcessedTwo);
    let df = this.createDf(linesFinished);
    df = this.cleanDf(df);
    this.generateMetrics(df);
    this.generateComments();
  };

  createLinesRaw = contentsString => {
    const contentsList = contentsString.split("\n");
    const linesRaw = [];
    contentsList.forEach(line => {
      if (line.length > 0 && line !== "\n") {
        const cleanedLine = line.replace("\n", "").trim() + "\n";
        linesRaw.push(cleanedLine);
      }
    });
    return linesRaw;
  };

  createLinesProcessedOne = linesRaw => {
    let lastNameShown = "";
    let lastFWDShown = "";
    let linesProcessed = [];

    for (let i = 0; i < linesRaw.length; i++) {
      // Sender's name
      if (linesRaw[i] === SENDER) {
        // if (it's a forward, show forwarder's name
        if (
          linesRaw[i - 1] === FWD_MSG &&
          linesRaw[i - 11] !== SENDER &&
          linesRaw[i - 10] !== SENDER
        ) {
          linesProcessed.push(lastNameShown);
        }

        // Show sender's name
        linesProcessed.push(linesRaw[i + 1]);

        // Save it on buffers, as original sender or forwarder
        if (!linesRaw[i + 1].includes(FWD_SENDER)) {
          lastNameShown = linesRaw[i + 1];
        } else {
          lastFWDShown = linesRaw[i + 1];
        }
      }
      // Message
      else if (linesRaw[i] === MESSAGE) {
        // If it's not a reply nor the first message sent nor media, show sender's name
        if (
          ((linesRaw[i - 3] !== SENDER && linesRaw[i - 3] !== REPLY) ||
            (linesRaw[i - 3] === REPLY && linesRaw[i - 6] !== SENDER)) &&
          linesRaw[i - 12] !== MEDIA
        ) {
          linesProcessed.push(lastNameShown);
        }

        // if (it's a forward, show original sender's name
        if (linesRaw[i - 1] === FWD_MSG) {
          linesProcessed.push(lastFWDShown);
        }

        // if (it's not a media description
        if (linesRaw[i - 12] !== MEDIA) {
          // if (it's not a forward
          if (linesRaw[i - 1] !== FWD_MSG && linesRaw[i - 4] !== FWD_MSG) {
            linesProcessed.push(NOFWD_TAG);
          }

          linesProcessed.push(MESSAGE_TAG);
        }

        // Show message
        linesProcessed.push(linesRaw[i + 1]);
      }

      // Message timestamp
      else if (linesRaw[i].startsWith(TIMESTAMP)) {
        // Get timestamp substring from inside the tags
        linesProcessed.push(
          linesRaw[i].substring(
            linesRaw[i].indexOf(TIMESTAMP) + TIMESTAMP.length,
            linesRaw[i].length - 3
          ) + "\n"
        );
      }

      // Media (audio, images, videos, gifs...)
      else if (
        linesRaw[i] === MEDIA ||
        linesRaw[i].includes(MEDIA_PHOTO) ||
        linesRaw[i].includes(MEDIA_VIDEO)
      ) {
        // if (it's not the first message sent, show sender's name
        if (linesRaw[i - 8] !== SENDER && linesRaw[i - 11] !== SENDER)
          linesProcessed.push(lastNameShown);

        // if (it's not a forward
        if (linesRaw[i - 9] !== FWD_MSG) linesProcessed.push(NOFWD_TAG);

        // if (it's a photo
        if (linesRaw[i].includes(MEDIA_PHOTO))
          linesProcessed.push(MEDIA_PHOTO_TAG);
        // if (it's a video
        else if (linesRaw[i].includes(MEDIA_VIDEO))
          linesProcessed.push(MEDIA_VIDEO_TAG);
        // if (it's regular media
        else if (linesRaw[i + 3] !== CONTACT_CARD) {
          linesProcessed.push(MEDIA_TAG);

          // if (it has a description, show it in the same line
          if (linesRaw[i + 12] === MESSAGE) {
            linesProcessed.push("[" + linesRaw[i + 1].slice(0, -1) + "] ");
          } else {
            linesProcessed.push("[" + linesRaw[i + 1].slice(0, -1) + "]\n");
          }
        }

        // It's a contact card
        else {
          linesProcessed.push(CONTACT_CARD_TAG);
          linesProcessed.push("\n");
        }
      }

      // Polls
      else if (linesRaw[i] === POLL) {
        // If it's not the first message sent, show sender's name
        if (linesRaw[i - 5] !== SENDER && linesRaw[i - 8] !== SENDER)
          linesProcessed.push(lastNameShown);

        // If it's not a forward
        if (linesRaw[i - 6] !== FWD_MSG) linesProcessed.push(NOFWD_TAG);

        // Add tag
        linesProcessed.push(POLL_TAG);

        // List question as message content
        linesProcessed.push(linesRaw[i + 1]);
      }
    }

    return linesProcessed;
  };

  createLinesProcessedTwo = linesProcessed => {
    const htmlEntities = {
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&quot;": '"',
      "&apos;": "'",
      "&cent;": "¢",
      "&pound;": "£",
      "&yen;": "¥",
      "&euro;": "€",
      "&copy;": "©",
      "&reg;": "®"
    };

    for (let i = 0; i < linesProcessed.length; i++) {
      // Remove HTML newlines
      linesProcessed[i] = linesProcessed[i].replace("<br>", " ");

      // Remove <a> tags, keeping the links
      linesProcessed[i] = linesProcessed[i]
        .replace(/<a href.+?>/, "")
        .replace("</a>", "");

      // Replace all HTML entities
      for (let [k, v] of Object.entries(htmlEntities)) {
        linesProcessed[i] = linesProcessed[i].replace(k, v);
      }

      // Format forwarded messages
      if (linesProcessed[i].includes(FWD_SENDER)) {
        linesProcessed[i] = linesProcessed[i]
          .replace(FWD_SENDER, " | FWD @")
          .replace("  | FWD @", " | FWD @")
          .replace("</span>", "");
        linesProcessed[i].replace(/ +via @.+\| FWD/, " | FWD");
      }

      // Remove "via @" occurrences
      linesProcessed[i] = linesProcessed[i].replace(/ +via @.+/, "");
    }
    return linesProcessed;
  };

  createLinesFinished = linesProcessed => {
    // Join lines without line endings
    let skip = false;
    const linesFinished = [];
    for (let i = 0; i < linesProcessed.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (linesProcessed[i].endsWith("\n")) {
        linesFinished.push(linesProcessed[i]);
      } else {
        linesFinished.push(linesProcessed[i] + linesProcessed[i + 1]);
        skip = true;
      }
    }
    return linesFinished;
  };

  createDf = linesFinished => {
    // SETUP 2D ARRAY, SETUP LIST OF METRICS
    const df_array = [];
    let line_split = [];
    let line_num = 0;

    while (line_num < linesFinished.length) {
      // RENAME THE LINE
      const line = linesFinished[line_num];

      // DATETIME
      if (line.match(/\d{2}.\d{2}.\d{4} \d{2}.\d{2}.\d{2}/g)) {
        // APPEND LINE_SPLIT AND RESET IT
        if (line_split.length > 0) {
          line_split = this.processLineSplit(line_split);
          if (line_split) {
            df_array.push(line_split);
          }
          line_split = [];
        }

        // EXTRACT THE METRICS
        line_split.push(this.extractDatetime(line));
        line_split.push(this.extractSender(linesFinished[line_num + 1]));
        line_split.push(this.extractForwarded(linesFinished[line_num + 2]));

        line_num += 3;
        continue;
      }

      // TYPE
      else if (
        line.includes("<msg>") ||
        line.includes("<media_") ||
        line.includes("<contact_card>")
      ) {
        line_split.push(this.extractType(line));
      }

      // CONTENT
      else {
        line_split.push(this.extractContent(line));
      }

      // MOVE ON TO NEXT LINE
      line_num += 1;
    }

    // CREATE THE PANDAS DF
    const df = new DataFrame(df_array);
    df.columns = ["datetime", "sender", "forwarded", "type", "content"];
    return df;
  };

  processLineSplit = lineSplit => {
    if (lineSplit.length < 5) {
      const extension = Array(5 - lineSplit.length).fill("");
      lineSplit.push(...extension);
    }

    // TODO : THIS IS A TEMPORARY STOPGAP FOR FUTURE TELE-DESKTOP RELEASES
    if (lineSplit[4].includes("[Photo]")) {
      lineSplit[3] = MEDIA_PHOTO_TAG;
    } else if (lineSplit[4].includes("[Video")) {
      lineSplit[3] = MEDIA_VIDEO_TAG;
    } else if (lineSplit[4].includes("[Sticker]")) {
      lineSplit[3] = MEDIA_STICKER_TAG;
    }

    // DEBUG : INTEGRITY CHECK FOR EACH ELEMENT
    if (typeof lineSplit[0] !== "object") return null; // DATETIME
    if (typeof lineSplit[0] !== "object") return null; // DATETIME
    if (typeof lineSplit[1] !== "string") return null; // SENDER
    if (typeof lineSplit[2] !== "boolean") return null; //FORWARDED
    if (typeof lineSplit[3] !== "string") return null; // TYPE
    if (typeof lineSplit[4] !== "string") return null; // CONTENT

    return lineSplit.slice(0, 5);
  };

  extractDatetime = line => {
    line = line.replace("\r", "");
    const day = parseInt(
      line.match(/(\d{2}).\d{2}.\d{4} \d{2}:\d{2}:\d{2}/)[1]
    );
    const month =
      parseInt(line.match(/\d{2}.(\d{2}).\d{4} \d{2}:\d{2}:\d{2}/)[1]) - 1; // JS MONTHS ARE ZERO-INDEXED (IE. O-11, INCLUSIVE)
    const year = parseInt(
      line.match(/\d{2}.\d{2}.(\d{4}) \d{2}:\d{2}:\d{2}/)[1]
    );
    const hours = parseInt(
      line.match(/\d{2}.\d{2}.\d{4} (\d{2}):\d{2}:\d{2}/)[1]
    );
    const mins = parseInt(
      line.match(/\d{2}.\d{2}.\d{4} \d{2}:(\d{2}):\d{2}/)[1]
    );
    const secs = parseInt(
      line.match(/\d{2}.\d{2}.\d{4} \d{2}:\d{2}:(\d{2})/)[1]
    );
    const ms = 0;

    return new Date(year, month, day, hours, mins, secs, ms);
  };

  extractSender = line => {
    // BUG FIX : WHERE DATETIME IS EXTRACTED AFTER VIDEOS (08.03.2020 11:58:08)
    if (line.match(/\d{2}.\d{2}.\d{4} \d{2}:\d{2}:\d{2}/)) return null;
    // STRIP THE TRAILING NEWLINE CHARACTERS
    return line.slice(0, -1);
  };

  extractForwarded = line => {
    return !line.includes("<nfwd>");
  };

  extractType = line => {
    if (line.includes("msg")) return "msg";
    else if (line.includes("media_photo")) return "media_photo";
    else if (line.includes("media_video")) return "media_video";
    else if (line.includes("media_sticker")) return "media_sticker";
    else if (line.includes("contact_card")) return "contact_card";
  };

  extractContent = line => {
    // STRIP THE TRAILING NEWLINE CHARACTERS
    return line.slice(0, -1);
  };

  cleanDf = df => {
    const media_set = new Set([
      "media",
      "msg",
      "media_photo",
      "media_video",
      "media_sticker",
      "contact_card"
    ]);
    df = df.set(
      "forwarded",
      df.get("forwarded").map(x => (typeof x === typeof true ? x : null))
    );
    df = df.set(
      "type",
      df.get("type").map(x => x.replace(/<|>|[\r\n]/g, ""))
    );
    df = df.set(
      "type",
      df.get("type").map(x => (media_set.has(x) ? x : null))
    );
    df = df.filter(df.get("datetime").notnull());
    df = df.filter(df.get("sender").notnull());
    df = df.filter(df.get("forwarded").notnull());
    df = df.filter(df.get("type").notnull());
    df = df.filter(df.get("datetime").notnull());
    return df;
  };

  computeAvg = (arr, dp = 1) => {
    return parseFloat(
      ((arr => arr.reduce((a, b) => a + b, 0))(arr) / arr.length).toFixed(dp)
    );
  };

  filterDatetimes = (
    datetimes,
    timings,
    CUTOFF_MIN_HOURS = 0.016666, // AKA 1 MINUTE
    CUTOFF_MAX_HOURS = 168 // AKA 7 DAYS
  ) => {
    const datetimes_filtered = [];
    const timings_filtered = [];
    for (let i = 0; i < datetimes.length; i++) {
      if (timings[i] >= CUTOFF_MIN_HOURS && timings[i] <= CUTOFF_MAX_HOURS) {
        datetimes_filtered.push(datetimes[i]);
        timings_filtered.push(timings[i]);
      }
    }
    return [datetimes_filtered, timings_filtered];
  };

  generateMetrics = df => {
    // SENDERS
    this.sOne = df
      .get("sender")
      .unique()
      .toArray()
      .sort()[0];
    this.sTwo = df
      .get("sender")
      .unique()
      .toArray()
      .sort()[1];

    // DF SEPARATED BY SENDER
    this.dfOne = df
      .filter(df.get("sender").eq(this.sOne))
      .reset_index({ drop: true });
    this.dfTwo = df
      .filter(df.get("sender").eq(this.sTwo))
      .reset_index({ drop: true });

    // GET METRICS FOR EACH SENDER
    [
      this.sOneMsgCount,
      this.sOneWordCount,
      this.sOneWPMCount,
      this.sOnePhotoCount,
      this.sOneVideoCount,
      this.sOneStickerCount
    ] = this.generateCount(this.dfOne);
    [
      this.sTwoMsgCount,
      this.sTwoWordCount,
      this.sTwoWPMCount,
      this.sTwoPhotoCount,
      this.sTwoVideoCount,
      this.sTwoStickerCount
    ] = this.generateCount(this.dfTwo);

    // REPLY TIMING COUNT AND THEIR AVERAGE
    const TDDict = this.generate_reply_timings(df);
    this.sOneTimings = TDDict[this.sOne][0];
    this.sOneDatetimes = TDDict[this.sOne][1];
    this.sTwoTimings = TDDict[this.sTwo][0];
    this.sTwoDatetimes = TDDict[this.sTwo][1];

    // FILTER REPLY TIMINGS
    [this.sOneDatetimes, this.sOneTimings] = this.filterDatetimes(
      this.sOneDatetimes,
      this.sOneTimings
    );
    [this.sTwoDatetimes, this.sTwoTimings] = this.filterDatetimes(
      this.sTwoDatetimes,
      this.sTwoTimings
    );

    // COMPUTE AVERAGE REPLY TIMINGS
    this.sOneAverageRT = this.computeAvg(this.sOneTimings);
    this.sTwoAverageRT = this.computeAvg(this.sTwoTimings);

    // START AND END DATE OF CONVERSATION
    this.startDate = new Date(
      Math.min(this.sOneDatetimes[0], this.sTwoDatetimes[0])
    ).toDateString();
    this.endDate = new Date(
      Math.max(
        this.sOneDatetimes[this.sOneDatetimes.length - 1],
        this.sTwoDatetimes[this.sTwoDatetimes.length - 1]
      )
    ).toDateString();
  };

  generateCount = senderDf => {
    // MESSAGE COUNT
    const senderMsgCount = senderDf.length;

    // WORDS COUNT
    const senderWordCount = senderDf
      .get("content")
      .map(c => c.split(" ").length)
      .sum();

    // WPM COUNT
    const senderWPMCount = parseFloat(
      (senderWordCount / senderMsgCount).toFixed(1)
    );

    // PHOTO COUNT
    const senderPhotoCount = senderDf.filter(
      senderDf.get("type").eq("media_photo")
    ).length;

    // VIDEO COUNT
    const senderVideoCount = senderDf.filter(
      senderDf.get("type").eq("media_video")
    ).length;

    // STICKER COUNT
    const senderStickerCount = senderDf.filter(
      senderDf.get("type").eq("media_sticker")
    ).length;

    // RETURN ALL METRICS
    return [
      senderMsgCount,
      senderWordCount,
      senderWPMCount,
      senderPhotoCount,
      senderVideoCount,
      senderStickerCount
    ];
  };

  generate_reply_timings = df => {
    // GET COLUMN NAMES
    const dfCols = df.columns;

    // DROP ALL DUPLICATES ALONG ROLLING WINDOW
    const rowSubset = [df.values.toArray()[0].toArray()];
    const senderIndex = df.columns.toArray().indexOf("sender");
    const rows = df.values.toArray();

    for (let j = 1; j < rows.length; j++) {
      if (rows[j].toArray()[senderIndex] !== rows[j - 1].toArray()[senderIndex])
        rowSubset.push(rows[j].toArray());
    }

    df = new DataFrame(rowSubset);
    df.columns = dfCols.toArray();

    // GET THE RESPECTIVE SENDERS
    const sOne = df.get("sender").iloc(0);
    const sTwo = df.get("sender").iloc(1);

    // SET THE REPLY TIMINGS COLUMN
    df = df.set(
      "reply_timing",
      df
        .get("datetime")
        .diff()
        .div(1000 * 3600) // MS TO HOURS
    );

    // GET THE RESPECTIVE REPLY DATAFRAMES
    const dfOne = df.filter(df.get("sender").eq(sOne));
    const dfTwo = df.filter(df.get("sender").eq(sTwo));

    return {
      [sOne]: [
        dfOne.get("reply_timing").values.toArray(),
        dfOne.get("datetime").values.toArray()
      ],
      [sTwo]: [
        dfTwo.get("reply_timing").values.toArray(),
        dfTwo.get("datetime").values.toArray()
      ]
    };
  };
  // 50 vs 70
  generateMessageComments = () => {
    const MIN = Math.min(this.sOneMsgCount, this.sTwoMsgCount);
    const MAX = Math.max(this.sOneMsgCount, this.sTwoMsgCount);
    const DIFF = MAX - MIN;
    const MESSAGE_LOW = sender =>
      `On average, ${sender} sends 🥈${parseInt(
        (DIFF / MAX) * 100
      )}% fewer🥈 messages.`;
    const MESSAGE_HIGH = sender =>
      `On average, ${sender} sends 🥇${parseInt(
        (DIFF / MIN) * 100
      )}% more🥇 messages.`;
    this.sOneMsgComment =
      this.sOneMsgCount >= this.sTwoMsgCount
        ? MESSAGE_HIGH(this.sOne)
        : MESSAGE_LOW(this.sOne);
    this.sTwoMsgComment =
      this.sTwoMsgCount >= this.sOneMsgCount
        ? MESSAGE_HIGH(this.sTwo)
        : MESSAGE_LOW(this.sTwo);
  };

  generateWordComments = () => {
    const MIN = Math.min(this.sOneWordCount, this.sTwoWordCount);
    const MAX = Math.max(this.sOneWordCount, this.sTwoWordCount);
    const DIFF = MAX - MIN;
    const WORD_LOW = sender =>
      `${sender}, the quieter one in this conversation... by ${parseInt(
        (DIFF / MAX) * 100
      )}%! 🙂`;
    const WORD_HIGH = sender =>
      `Quite a chatty one aren't you, ${sender}! 😉 On average, you were ${parseInt(
        (DIFF / MIN) * 100
      )}% as... verbose!`;
    this.sOneWordComment =
      this.sOneWordCount >= this.sTwoWordCount
        ? WORD_HIGH(this.sOne)
        : WORD_LOW(this.sOne);
    this.sTwoWordComment =
      this.sTwoWordCount >= this.sOneWordCount
        ? WORD_HIGH(this.sTwo)
        : WORD_LOW(this.sTwo);
  };

  generateWPMComments = () => {
    const MIN = Math.min(this.sOneWPMCount, this.sTwoWPMCount);
    const MAX = Math.max(this.sOneWPMCount, this.sTwoWPMCount);
    const DIFF = MAX - MIN;
    const WPM_LOW = sender =>
      `Obviously the quieter one, ${sender}! 😉 On average, your texts are ${parseInt(
        (DIFF / MAX) * 100
      )}% shorter.`;
    const WPM_HIGH = sender =>
      `Quite a chatty one aren't you, ${sender}! 😉 On average, your texts are ${parseInt(
        (DIFF / MIN) * 100
      )}% longer.`;
    this.sOneWPMComment =
      this.sOneWPMCount >= this.sTwoWPMCount
        ? WPM_HIGH(this.sOne)
        : WPM_LOW(this.sOne);
    this.sTwoWPMComment =
      this.sTwoWPMCount >= this.sOneWPMCount
        ? WPM_HIGH(this.sTwo)
        : WPM_LOW(this.sTwo);
  };

  generatePhotoComments = () => {
    const MIN = Math.min(this.sOnePhotoCount, this.sTwoPhotoCount);
    const MAX = Math.max(this.sOnePhotoCount, this.sTwoPhotoCount);
    const DIFF = MAX - MIN;
    const PHOTO_LOW = sender =>
      `Perhaps words suit you better, ${sender}! 😉 On average, you sent ${parseInt(
        (DIFF / MAX) * 100
      )}% fewer pictures!`;
    const PHOTO_HIGH = sender =>
      `Maybe you express yourself better with 📸📸📸, ${sender}? On average, you sent ${parseInt(
        (DIFF / MIN) * 100
      )}% more pictures!`;
    this.sOnePhotoComment =
      this.sOnePhotoCount >= this.sTwoPhotoCount
        ? PHOTO_HIGH(this.sOne)
        : PHOTO_LOW(this.sOne);
    this.sTwoPhotoComment =
      this.sTwoPhotoCount >= this.sOnePhotoCount
        ? PHOTO_HIGH(this.sTwo)
        : PHOTO_LOW(this.sTwo);
  };

  generateVideoComments = () => {
    const MIN = Math.min(this.sOneVideoCount, this.sTwoVideoCount);
    const MAX = Math.max(this.sOneVideoCount, this.sTwoVideoCount);
    const DIFF = MAX - MIN;
    const VIDEO_LOW = sender =>
      `Videos are certainly an even more expressive medium than pictures, ${sender}! 😎 In total, you sent ${parseInt(
        (DIFF / MAX) * 100
      )}% fewer 📽!`;
    const VIDEO_HIGH = sender =>
      `Lots of videos you sent, ${sender}! 😉 In total, you sent ${parseInt(
        (DIFF / MIN) * 100
      )}% more 📽!`;
    this.sOneVideoComment =
      this.sOneVideoCount >= this.sTwoVideoCount
        ? VIDEO_HIGH(this.sOne)
        : VIDEO_LOW(this.sOne);
    this.sTwoVideoComment =
      this.sTwoVideoCount >= this.sOneVideoCount
        ? VIDEO_HIGH(this.sTwo)
        : VIDEO_LOW(this.sTwo);
  };

  generateStickerComments = () => {
    const MIN = Math.min(this.sOneStickerCount, this.sTwoStickerCount);
    const MAX = Math.max(this.sOneStickerCount, this.sTwoStickerCount);
    const DIFF = MAX - MIN;
    const STICKER_LOW = sender =>
      `Get a sticker pack already, ${sender}! 😎 In total, you sent ${parseInt(
        (DIFF / MAX) * 100
      )}% fewer stickers!`;
    const STICKER_HIGH = sender =>
      `Please share some of your stickers, ${sender}! 😉 In total, you sent ${parseInt(
        (DIFF / MIN) * 100
      )}% more stickers!`;
    this.sOneStickerComment =
      this.sOneStickerCount >= this.sTwoStickerCount
        ? STICKER_HIGH(this.sOne)
        : STICKER_LOW(this.sOne);
    this.sTwoStickerComment =
      this.sTwoStickerCount >= this.sOneStickerCount
        ? STICKER_HIGH(this.sTwo)
        : STICKER_LOW(this.sTwo);
  };

  generateAverageRTComments = () => {
    const MIN = Math.min(this.sOneAverageRT, this.sTwoAverageRT);
    const MAX = Math.max(this.sOneAverageRT, this.sTwoAverageRT);
    const DIFF = MAX - MIN;
    const AVERAGE_RT_LOW = sender =>
      `Always on your phone, I see, ${sender}! 🤓 On average, you are ${parseInt(
        (DIFF / MAX) * 100
      )}% quicker to respond!`;
    const AVERAGE_RT_HIGH = sender =>
      `Quite the busy one, ${sender}! 😎 On average, you take ${parseInt(
        (DIFF / MIN) * 100
      )}% longer to return your texts!`;
    this.sOneAverageRTComment =
      this.sOneAverageRT >= this.sTwoAverageRT
        ? AVERAGE_RT_HIGH(this.sOne)
        : AVERAGE_RT_LOW(this.sOne);
    this.sTwoAverageRTComment =
      this.sTwoAverageRT >= this.sOneAverageRT
        ? AVERAGE_RT_HIGH(this.sTwo)
        : AVERAGE_RT_LOW(this.sTwo);
  };

  generateComments = () => {
    //TODO : GENERATE COMMENTS EACH METRIC
    this.generateMessageComments();
    this.generateWordComments();
    this.generateWPMComments();
    this.generatePhotoComments();
    this.generateVideoComments();
    this.generateStickerComments();
    this.generateAverageRTComments();
  };
}

export default Analyzer;
