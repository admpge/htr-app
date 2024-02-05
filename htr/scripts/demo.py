import json
import cv2
import os  # Import the os module
import sys  # Import the sys module

from htr_pipeline import read_page, DetectorConfig, LineClusteringConfig, ReaderConfig, PrefixTree

# Define the input image file path as an absolute path
img_filename = sys.argv[1]  # Replace with the input image file path

# Choose the decoder type (either 'best_path' or 'word_beam_search')
decoder = 'best_path'  # Replace with the decoder type you want to use

# Get the directory of the current script
dir_path = os.path.dirname(os.path.realpath(__file__))

# Use os.path.join to construct the path to the config file
config_path = os.path.join(dir_path, '..', 'data', 'config.json')
word_list_path = os.path.join(dir_path, '..', 'data', 'words_alpha.txt')

with open(config_path) as f:
    sample_config = json.load(f)

with open(word_list_path) as f:
    word_list = [w.strip().upper() for w in f.readlines()]
prefix_tree = PrefixTree(word_list)

# Read the text from the single image with the chosen decoder
img = cv2.imread(img_filename, cv2.IMREAD_GRAYSCALE)
scale = sample_config[os.path.basename(img_filename)]['scale'] if os.path.basename(img_filename) in sample_config else 1
margin = sample_config[os.path.basename(img_filename)]['margin'] if os.path.basename(img_filename) in sample_config else 0
read_lines = read_page(img,
                       detector_config=DetectorConfig(scale=scale, margin=margin),
                       line_clustering_config=LineClusteringConfig(min_words_per_line=2),
                       reader_config=ReaderConfig(decoder=decoder, prefix_tree=prefix_tree))

# Output text
for read_line in read_lines:
    print(' '.join(read_word.text for read_word in read_line))
