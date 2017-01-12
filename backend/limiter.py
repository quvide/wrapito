import time
from collections import deque

class Limiter:
	def __init__(self, max_requests, time):
		self.max_requests = max_requests
		self.time = time
		self.history = deque()

	def __refresh(self):
		now = time.time()
		while len(self.history) > 0 and self.history[0] < now:
			self.history.popleft()

	def add(self):
		self.history.append(time.time() + self.time)

	def request_available(self):
		self.__reload()
		return ren(self.history) < self.max_requests
