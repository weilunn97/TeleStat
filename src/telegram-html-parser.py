########################################################
#            Telegram Chat History Converter           #
#                        Mar 2020                      #
#                                                      #
#   Converts all message.html Telegram files to .txt   #
#        and .csv files for easier processing.         #
#                                                      #
# Code by    : Gabriel Kanegae Souza                   #
# Adapted by : Tan Wei Lun                             #
########################################################
import sys

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from os import listdir, chdir
from os.path import isdir
from re import match, sub
from sys import argv

# # Command line options
# HELP_FLAG = "-h"
# TXT_FLAG = "-txt"
# CSV_FLAG = "-csv"
# OUTPUT_FLAG = "-o"
# DIR_FLAG = "-d"
# generateTXT, generateCSV = True, True
# outputFile, dirName = "", ""

# HTML div headers for each element
TIMESTAMP = '<div class="pull_right date details" title="'
SENDER = '<div class="from_name">\n'
FWD_MSG = '<div class="forwarded body">\n'
FWD_SENDER = '<span class="details">'
MESSAGE = '<div class="text">\n'
MEDIA = '<div class="title bold">\n'
MEDIA_PHOTO = '<img class="photo"'
MEDIA_VIDEO = '<img class="video_file"'
REPLY = '<div class="reply_to details">\n'
CONTACT_CARD = '<div class="status details">\n'
POLL = '<div class="question bold">\n'

# Identifiers for the element types
MEDIA_TAG = "<media>\n"
MEDIA_PHOTO_TAG = "<media_photo>\n"
MEDIA_VIDEO_TAG = "<media_video>\n"
MESSAGE_TAG = "<msg>\n"
NOFWD_TAG = "<nfwd>\n"
CONTACT_CARD_TAG = "<contact_card>\n"
POLL_TAG = "<poll>\n"

# Separator for the .csv file
CSV_SEP = ";"

# # Invalid flag
# args = [HELP_FLAG, TXT_FLAG, CSV_FLAG, OUTPUT_FLAG, DIR_FLAG]
# for arg in argv:
#     if arg.startswith("-") and arg not in args:
#         print("Unknown flag '{}'. Run with {} for more info.".format(arg, HELP_FLAG))
#         exit()
#
# # Help flag
# if HELP_FLAG in argv:
#     print("USAGE: python3 telegram-export-converter.py [FLAGS]")
#     print()
#     print("FLAGS:")
#     print("{} \t\t - Shows this help page.".format(HELP_FLAG))
#     print("{}, {} \t - Generates only the .txt or .csv file. Default: generates both".format(TXT_FLAG, CSV_FLAG))
#     print("{} (FILENAME) \t - Sets output filename. Default: Telegram-CHATNAME".format(OUTPUT_FLAG))
#     print("{} (DIRECTORY) \t - Runs the script as if in that directory,".format(DIR_FLAG))
#     print("\t\t but generating output files in the current directory.")
#     exit()
#
# # .txt and .csv selection flags
# if TXT_FLAG in argv and CSV_FLAG not in argv:
#     generateCSV = False
# elif CSV_FLAG in argv and TXT_FLAG not in argv:
#     generateTXT = False
#
# # Output filename flag
# if OUTPUT_FLAG in argv:
#     try:
#         outputFile = argv[argv.index(OUTPUT_FLAG) + 1].split(".")[0]
#     except IndexError:
#         print("No filename informed for flag {}. Run with {} for more information.".format(OUTPUT_FLAG, HELP_FLAG))
#         exit()
#
# # Directory flag
# if DIR_FLAG in argv:
#     try:
#         dirName = argv[argv.index(DIR_FLAG) + 1].replace("/", "")
#     except IndexError:
#         print("No filename informed for flag {}. Run with {} for more information.".format(DIR_FLAG, HELP_FLAG))
#         exit()
#
# # Check if directory from -d actually exists
# listdirFull = listdir()
# if dirName != "":
#     if dirName not in listdirFull or isdir(dirName) == False:
#         print("Directory '{}' doesn't exist. Exiting...".format(dirName))
#         exit()
#     print("Starting at directory '{}'. ".format(dirName))
#     chdir(dirName)
# else:
#     print("Starting...")

# Scans current directory for message<n>.html Telegram chat export files
# messageFiles = []
# counter = 1
# for file in listdir():
#     if file.startswith("messages") and file.endswith(".html"):
#         messageFiles.append("messages" + (str(counter) if counter > 1 else "") + ".html")
#         counter += 1
#
# if len(messageFiles) == 0:
#     print("No message.html files found. Are you sure the script is in the right directory? Exiting...")
#     exit()
#
# print("Loading all {} message files...".format(len(messageFiles)))

f = sys.argv[1]


# # Loads all files content into memory
# linesRaw = []
# for file in messageFiles:
#     with open(file, encoding="UTF-8") as f:
#         for line in f:
#             if len(line) > 0 and line != "\n":
#                 linesRaw.append(line.replace("\n", "").strip() + "\n")

linesRaw = []
print(f)
for line in f:
    if len(line) > 0 and line != "\n":
        linesRaw.append(line.replace("\n", "").strip() + "\n")

# Sets default filename as the chat's name, if not provided as argument
# if outputFile == "":
#     outputFile = "Telegram-" + linesRaw[15][:-1].replace(" ", "_")
outputFile = "Telegram-" + linesRaw[15][:-1].replace(" ", "_")

print("Processing...")
linesProcessed = []

# Buffers to store sender's name (when they send many messages, it's only shown once)
lastNameShown, lastFWDShown = "", ""

# Processes each element and filters them
for i in range(len(linesRaw)):

    ### DEBUG ###
    linesRawI = linesRaw[i]
    ### DEBUG ###

    # Sender's name
    if linesRaw[i] == SENDER:
        # If it's a forward, show forwarder's name
        if linesRaw[i - 1] == FWD_MSG and linesRaw[i - 11] != SENDER and linesRaw[i - 10] != SENDER:
            linesProcessed.append(lastNameShown)

        # Show sender's name
        linesProcessed.append(linesRaw[i + 1])

        # Save it on buffers, as original sender or forwarder
        if FWD_SENDER not in linesRaw[i + 1]:
            lastNameShown = linesRaw[i + 1]
        else:
            lastFWDShown = linesRaw[i + 1]

    # Message
    elif linesRaw[i] == MESSAGE:
        # If it's not a reply nor the first message sent nor media, show sender's name
        if ((linesRaw[i - 3] != SENDER and linesRaw[i - 3] != REPLY) or (
                linesRaw[i - 3] == REPLY and linesRaw[i - 6] != SENDER)) and (linesRaw[i - 12] != MEDIA):
            linesProcessed.append(lastNameShown)

        # If it's a forward, show original sender's name
        if linesRaw[i - 1] == FWD_MSG:
            linesProcessed.append(lastFWDShown)

        # If it's not a media description
        if linesRaw[i - 12] != MEDIA:
            # If it's not a forward
            if  linesRaw[i - 1] != FWD_MSG and linesRaw[i - 4] != FWD_MSG:
               linesProcessed.append(NOFWD_TAG)

            linesProcessed.append(MESSAGE_TAG)

        # Show message
        linesProcessed.append(linesRaw[i + 1])

    # Message timestamp
    elif linesRaw[i].startswith(TIMESTAMP):
        # Get timestamp substring from inside the tags
        linesProcessed.append(linesRaw[i][linesRaw[i].index(TIMESTAMP) + len(TIMESTAMP):-3] + "\n")

    # Media (audio, images, videos, gifs...)
    elif (linesRaw[i] == MEDIA) or (MEDIA_PHOTO in linesRaw[i]) or (MEDIA_VIDEO in linesRaw[i]):

        # If it's not the first message sent, show sender's name
        if linesRaw[i - 8] != SENDER and linesRaw[i - 11] != SENDER:
            linesProcessed.append(lastNameShown)

        # If it's not a forward
        if linesRaw[i - 9] != FWD_MSG:
            linesProcessed.append(NOFWD_TAG)

        # If it's a photo
        if MEDIA_PHOTO in linesRaw[i]:
            linesProcessed.append(MEDIA_PHOTO_TAG)

        # If it's a video
        elif MEDIA_VIDEO in linesRaw[i]:
            linesProcessed.append(MEDIA_VIDEO_TAG)

        # If it's regular media
        elif linesRaw[i + 3] != CONTACT_CARD:
            linesProcessed.append(MEDIA_TAG)

            # If it has a description, show it in the same line
            if linesRaw[i + 12] == MESSAGE:
                linesProcessed.append("[" + linesRaw[i + 1][:-1] + "] ")
            else:
                linesProcessed.append("[" + linesRaw[i + 1][:-1] + "]\n")
        else:  # It's a contact_card
            linesProcessed.append(CONTACT_CARD_TAG)
            linesProcessed.append("\n")

    # Polls
    elif linesRaw[i] == POLL:
        # If it's not the first message sent, show sender's name
        if linesRaw[i - 5] != SENDER and linesRaw[i - 8] != SENDER:
            linesProcessed.append(lastNameShown)

        # If it's not a forward
        if linesRaw[i - 6] != FWD_MSG:
            linesProcessed.append(NOFWD_TAG)

        # Add tag
        linesProcessed.append(POLL_TAG)

        # List question as message content
        linesProcessed.append(linesRaw[i + 1])

htmlEntities = {"&lt;": "<", "&gt;": ">", "&amp;": "&",
                "&quot;": "\"", "&apos;": "'", "&cent;": "¢",
                "&pound;": "£", "&yen;": "¥", "&euro;": "€",
                "&copy;": "©", "&reg;": "®"}

# Final cleanup, to remove leftover HTML tags
for i in range(len(linesProcessed)):
    # Remove HTML newlines
    linesProcessed[i] = linesProcessed[i].replace("<br>", " ")

    # Remove <a> tags, keeping the links
    linesProcessed[i] = sub(r"<a href=\".+\">", "", linesProcessed[i]).replace("</a>", " ")

    # Replace all HTML entities
    for (k, v) in htmlEntities.items():
        linesProcessed[i] = linesProcessed[i].replace(k, v)

    # Format forwarded messages
    if FWD_SENDER in linesProcessed[i]:
        linesProcessed[i] = linesProcessed[i].replace(FWD_SENDER, " | FWD @").replace("  | FWD @", " | FWD @").replace(
            "</span>", "")
        linesProcessed[i] = sub(r" +via @.+\| FWD", " | FWD", linesProcessed[i])

    # Remove "via @" occurences
    linesProcessed[i] = sub(r" +via @.+", "", linesProcessed[i])

# Join lines without line endings
skip = False
linesFinished = []
for i in range(len(linesProcessed)):
    if skip:
        skip = False
        continue

    if linesProcessed[i].endswith("\n"):
        linesFinished.append(linesProcessed[i])
    else:
        linesFinished.append(linesProcessed[i] + linesProcessed[i + 1])
        skip = True

# # If inside a directory, go back
# if DIR_FLAG in argv:
#     chdir("..")

# Writes to .txt
# if generateTXT:
#     print("Writing to file '{}.txt'...".format(outputFile))
#     with open(outputFile + ".txt", "w", encoding="UTF-16") as f:
#         for line in linesFinished:
#             f.write(line)


# Writes to .csv
def parse_f_lines(f_lines):
    # SETUP 2D ARRAY, SETUP LIST OF METRICS
    df_array = []
    line_split = []
    line_num = 0

    while line_num < len(f_lines):

        # RENAME THE LINE
        line = f_lines[line_num]
        # DATETIME AND SENDER
        if match(r'\d\d.\d\d.\d\d\d\d \d\d.\d\d.\d\d', line):

            # APPEND LINE_SPLIT AND RESET IT
            if len(line_split):
                line_split = process_line_split(line_split)
                df_array.append(line_split)
                line_split = []

            # EXTRACT THE METRICS
            line_split.append(extract_datetime(line))
            line_split.append(extract_sender(f_lines[line_num + 1]))

            line_num += 2
            continue

        # FORWARDED
        elif 'fwd' in line.lower():
            line_split.append(extract_forwarded(line))

        # TYPE
        elif ('<msg>' in line) or ('<media_' in line) or ('<contact_card>' in line):
            line_split.append(extract_type(line))

        # CONTENT
        else:
            line_split.append(extract_content(line))

        # MOVE ON TO NEXT LINE
        line_num += 1

    return df_array


def process_line_split(line_split):
    if len(line_split) < 5:
        line_split.extend([np.nan for i in range(5 - len(line_split))])

    if len(line_split) > 5:
        return line_split[:5]

    return line_split


def extract_datetime(line):
    line = line.strip('\r')
    return datetime.strptime(line, '%d.%m.%Y %H:%M:%S')


def extract_sender(line):
    # STRIP THE TRAILING NEWLINE CHARACTERS
    return line[:-1]


def extract_forwarded(line):
    return True if 'FWD @' in line else False


def extract_type(line):
    if 'msg' in line:
        return 'msg'
    elif 'media_photo' in line:
        return 'media_photo'
    elif 'media_video' in line:
        return 'media_video'
    elif 'contact_card' in line:
        return 'contact_card'


def extract_content(line):
    # STRIP THE TRAILING NEWLINE CHARACTERS
    return line[:-1]


def set_column_dtypes(df):
    df['datetime'] = df['datetime'].astype('datetime64')
    df['sender'] = df['sender'].astype('category')
    df['forwarded'] = df['forwarded'].astype('category')
    df['type'] = df['type'].astype('category')
    return df


def clean_df(df):
    df['forwarded'] = df['forwarded'].apply(lambda x: x if isinstance(x, bool) else np.nan)
    media_set = set(['msg', 'media_photo', 'media_video', 'contact_card'])
    df['type'] = df['type'].apply(lambda x: x if x in media_set else np.nan)
    return df


def generate_metrics(df):
    # SENDERS
    sOne, sTwo = sorted(df['sender'].unique())[0], sorted(df['sender'].unique())[1]
    dfOne, dfTwo = df[df['sender'] == sOne].reset_index(), df[df['sender'] == sTwo].reset_index()

    # GET METRICS FOR EACH SENDER
    sOneMsgCount, sOneWordCount, sOneWPMCount, sOnePhotoCount, sOneVideoCount = generate_count(dfOne)
    sTwoMsgCount, sTwoWordCount, sTwoWPMCount, sTwoPhotoCount, sTwoVideoCount = generate_count(dfTwo)

    # REPLY TIMING COUNT AND THEIR AVERAGE
    # TODO : DROP ALL REPLY TIMINGS THAT ARE <= 1MINUTE
    CUTOFF_TIME = timedelta(minutes=1)
    td_dict = generate_reply_timings(df)
    sOneTimings = [td[0] for td in td_dict[sOne] if td[0] > CUTOFF_TIME]
    sTwoTimings = [td[0] for td in td_dict[sTwo] if td[0] > CUTOFF_TIME]
    sOneDatetimes = [td[1] for td in td_dict[sOne] if td[0] > CUTOFF_TIME]
    sTwoDatetimes = [td[1] for td in td_dict[sTwo] if td[0] > CUTOFF_TIME]
    
    sOneAverageRT = sum(sOneTimings, timedelta()) / len(sOneTimings)
    sTwoAverageRT = sum(sTwoTimings, timedelta()) / len(sTwoTimings)


    ### DEBUG ###
    print('SENDER ONE :', sOne)
    print('SENDER TWO :', sTwo)
    print(sOneAverageRT, sTwoAverageRT)
    print(len(sOneTimings), len(sOneDatetimes))
    print(len(sTwoTimings), len(sTwoDatetimes))
    ### DEBUG ###




def generate_count(sender_df):
    # MESSAGE COUNT
    senderMsgCount = len(sender_df)

    # WORDS COUNT
    senderWordCount = sender_df['content'].str.len().sum()

    # WPM COUNT
    senderWPMCount = int(senderWordCount / senderMsgCount)

    # PHOTO COUNT
    senderPhotoCount = len(sender_df[sender_df['type'] == 'media_photo'])

    # VIDEO COUNT
    senderVideoCount = len(sender_df[sender_df['type'] == 'media_video'])

    # RETURN ALL METRICS
    return senderMsgCount, senderWordCount, senderWPMCount, senderPhotoCount, senderVideoCount


def generate_reply_timings(df):

    # RESET THE DF INDEX FIRST
    df = df.reset_index()

    # DROP ALL DUPLICATES ALONG ROLLING WINDOW
    index_subset = [0]
    sender_index = df.columns.tolist().index('sender')
    rows = [row for row in df.itertuples(index=False)]

    for j in range(1, len(rows)):
        if rows[j][sender_index] != rows[j-1][sender_index]:
            index_subset.append(j)

    df = df.iloc[index_subset, :]

    # CALCULATE MEAN DIFFERENCE
    reply_timings = df['datetime'].diff()[1:]
    reply_datetime = df['datetime'][1:]
    timing_datetime = [td for td in zip(reply_timings, reply_datetime)]

    sOne = df['sender'].iloc[0]
    sOne_timing_datetime = timing_datetime[1:len(timing_datetime):2]

    sTwo = df['sender'].iloc[1]
    sTwo_timing_datetime = timing_datetime[0:len(timing_datetime):2]

    return {sOne : sOne_timing_datetime, sTwo : sTwo_timing_datetime}


# READ THE FILE, GENERATE LIST OF LINES
print("Writing to file '{}.csv'...".format(outputFile))
# f_str = open(outputFile + ".txt", "rb").read().decode('utf-16')
# f_lines = f_str.split('\n')

# SETUP COLUMN HEADERS
columns = ['datetime', 'sender', 'forwarded', 'type', 'content']

# PARSE THE LIST OF LINES
df_array = parse_f_lines(linesFinished)

# CONVERT TO DF
df = pd.DataFrame(df_array, columns=columns)

# CHECK DATA INTEGRITY
df = clean_df(df)

# DROP ALL NULLS
df = df.dropna(subset=['datetime', 'sender', 'forwarded', 'type'])

# SET COLUMN DTYPES
df = set_column_dtypes(df)

# WRITE OUT TO CSV
df.to_csv(outputFile + '.csv', na_rep='', index=False)
print("All done!")

# GENERATE METRICS
print("Generating metrics...")
generate_metrics(df)

print('YOOOHOOO')
sys.stdout.flush()

