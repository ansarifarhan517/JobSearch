import logging
import os
from datetime import datetime
from colorama import Fore, Style, init as colorama_init
import dotenv

colorama_init(autoreset=True)
dotenv.load_dotenv()

# --- Setup log directory ---
log_dir = os.path.join(os.path.dirname(__file__), "../logs")
os.makedirs(log_dir, exist_ok=True)

# --- File name: email + timestamp ---
email = os.getenv("USER", "unknown_user").replace("@", "_").replace(".", "_")
timestamp = datetime.now().strftime("%d-%m-%Y_%I-%M-%S %p")

log_file = os.path.join(log_dir, f"{email}_{timestamp}.log")

# --- Formatter ---
formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] [%(module)s:%(lineno)d] %(message)s",
    datefmt="%d-%m-%Y %I:%M:%S %p"
)

class ColorFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': Fore.CYAN,
        'INFO': Fore.GREEN,
        'WARNING': Fore.YELLOW,
        'ERROR': Fore.RED,
        'CRITICAL': Fore.RED + Style.BRIGHT,
    }

    def format(self, record):
        color = self.COLORS.get(record.levelname, "")
        message = super().format(record)
        return f"{color}{message}{Style.RESET_ALL}"

# --- Handlers ---
file_handler = logging.FileHandler(log_file, encoding="utf-8")
file_handler.setFormatter(formatter)
file_handler.setLevel(logging.INFO)

stream_handler = logging.StreamHandler()
stream_handler.setFormatter(ColorFormatter(
    "%(asctime)s [%(levelname)s] [%(module)s:%(lineno)d] %(message)s",
    datefmt="%d-%m-%Y %I:%M:%S %p"
))
stream_handler.setLevel(logging.INFO)

# --- Logger ---
logger = logging.getLogger("JobAutomationLogger")
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)
logger.addHandler(stream_handler)
logger.propagate = False

logger.info("🚀 Logger initialized successfully!")
