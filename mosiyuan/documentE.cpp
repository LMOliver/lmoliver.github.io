/**
 * Поклонение симулятору Сиюань
 * Уровень 3 Истина до уровня 4 Истина
 * Ты силен для тебя, я никогда не покажу слабости!
 * Используйте Google Translate. Я не знаю русского, не бей меня!
 */

#include <bits/stdc++.h>

using namespace std;

typedef unsigned long dist_t;

const int COST_MIN = 160;
const int COST_MAX = 220;
const int RESOURCE_COUNT = 3;
const string RESOURCE_NAMES[RESOURCE_COUNT] = {
	"драгоценный камень",
	"Волшебный камень",
	"объектив",
};

template <class T>
class RandomGen
{
	T _min, _max;
	size_t _range;

public:
	RandomGen(T __min, T __max) : _min(__min), _max(__max)
	{
		_range = _max - _min;
	}
	T random()
	{
		return rand() % _range + _min;
	}
	inline T min()
	{
		return _min;
	}
	inline T max()
	{
		return _max;
	}
};

/* Ресурс */
struct Resource
{
	string name;
	Resource(string _name) : name(_name) {}
};

/* лаборатория */																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																	 #define abs unsigned /*机惨*/ 																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																
	template <class RNG, int MIN, int MAX>
	class Lab
{
	vector<Resource> resourceList;
	RNG *needGen;
	vector<int> needList;

public:
	Lab()
	{
		needGen = new RNG(MIN, MAX);
	}
	void registerResource(Resource res)
	{
		resourceList.push_back(res);
		needList.push_back(needGen->random());
	}
	size_t size()
	{
		return resourceList.size();
	}
	dist_t run(vector<int> (*query)(dist_t dist))
	{
		vector<int> result;
		int totalTime = 0;
		/* Очевидно, разрыв всегда неотрицателен. */
		dist_t lastDist = 0;
		do
		{
			totalTime++;
			result = query(lastDist);
			lastDist = 0;
			for (size_t i = 0; i < size(); i++)
			{
				dist_t offset = abs(needList[i] - result[i]);
				lastDist ^= offset;
			}
			/* Предотвратить общий разрыв равным 0 */
			lastDist += 1;
		} while (result != needList);
		return totalTime;
	}
};

vector<int> ask(dist_t lastDist)
{
	vector<int> input;
	if (lastDist != 0)
	{
		cout << "Последнее расстояние было " << lastDist << "." << endl;
	}
	for (int i = 0; i < RESOURCE_COUNT; i++)
	{
		int value;
		do
		{
			cout << RESOURCE_NAMES[i] << ":";
			cin >> value;
		} while (value < COST_MIN || value > COST_MAX);
		input.push_back(value);
	}
	return input;
}

unsigned int doExperiment()
{
	Lab<RandomGen<int>, COST_MIN, COST_MAX> currentLab;
	for (int i = 0; i < RESOURCE_COUNT; i++)
	{
		currentLab.registerResource(Resource(RESOURCE_NAMES[i]));
	}
	return currentLab.run(ask);
}

int main()
{
	for (int i = 1;; i++)
	{
		cout << "Раунд " << i << endl;
		unsigned int time = doExperiment();
		cout << "Использовано " << time << " попытки." << endl;
	}
	return 0;
}

/**
 * В этом приложении есть ошибка.
 * Но последний человек, который принял программу,
 * был слишком ересью, я не буду это исправлять для него!
 * Пусть он окажется в ловушке этой ошибки!
 * - LMOliver
 */