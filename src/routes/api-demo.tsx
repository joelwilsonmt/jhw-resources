import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Loader2,
  Search,
  RefreshCw,
  Zap,
  Heart,
  Shield,
  Swords,
} from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
}

interface PokemonList {
  results: Array<{
    name: string;
    url: string;
  }>;
}

// Fetch functions
const fetchPokemon = async (nameOrId: string): Promise<Pokemon> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`
  );
  if (!response.ok) {
    throw new Error(`Pokemon "${nameOrId}" not found`);
  }
  return response.json();
};

const fetchPokemonList = async (): Promise<PokemonList> => {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon list');
  }
  return response.json();
};

function PokemonPage() {
  const [searchTerm, setSearchTerm] = useState('pikachu');
  const [currentPokemon, setCurrentPokemon] = useState('pikachu');

  // Query for Pokemon list
  const { data: pokemonList, isLoading: listLoading } = useQuery({
    queryKey: ['pokemonList'],
    queryFn: fetchPokemonList,
  });

  // Query for specific Pokemon
  const {
    data: pokemon,
    isLoading: pokemonLoading,
    error: pokemonError,
    isFetching,
  } = useQuery({
    queryKey: ['pokemon', currentPokemon],
    queryFn: () => fetchPokemon(currentPokemon),
    enabled: !!currentPokemon,
  });

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setCurrentPokemon(searchTerm.trim());
    }
  };

  const handleRandomPokemon = () => {
    if (pokemonList?.results) {
      const randomIndex = Math.floor(
        Math.random() * pokemonList.results.length
      );
      const randomPokemon = pokemonList.results[randomIndex];
      if (randomPokemon) {
        setCurrentPokemon(randomPokemon.name);
        setSearchTerm(randomPokemon.name);
      }
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-300',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'hp':
        return <Heart className="h-4 w-4" />;
      case 'attack':
        return <Swords className="h-4 w-4" />;
      case 'defense':
        return <Shield className="h-4 w-4" />;
      case 'speed':
        return <Zap className="h-4 w-4" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-primary/20" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Pokemon API Demo</h1>
        <p className="text-muted-foreground">
          TanStack Query with Pokemon API showcase
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pokemon Search
          </CardTitle>
          <CardDescription>
            Search for any Pokemon by name or ID (1-151)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Pokemon name or ID
              </Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Enter Pokemon name or ID..."
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isFetching}>
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleRandomPokemon}
              disabled={listLoading}
            >
              <RefreshCw className="h-4 w-4" />
              Random
            </Button>
          </div>

          {pokemonError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              Error: {pokemonError.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pokemon Details */}
      {pokemonLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading Pokemon...</p>
            </div>
          </CardContent>
        </Card>
      ) : pokemon ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pokemon Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize text-2xl">{pokemon.name}</span>
                <span className="text-muted-foreground">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>
              </CardTitle>
              <div className="flex gap-2">
                {pokemon.types.map(type => (
                  <span
                    key={type.type.name}
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium capitalize ${getTypeColor(
                      type.type.name
                    )}`}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <img
                  src={
                    pokemon.sprites.other['official-artwork'].front_default ||
                    pokemon.sprites.front_default
                  }
                  alt={pokemon.name}
                  className="w-48 h-48 mx-auto object-contain"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Height:</span>{' '}
                  {(pokemon.height / 10).toFixed(1)}m
                </div>
                <div>
                  <span className="font-medium">Weight:</span>{' '}
                  {(pokemon.weight / 10).toFixed(1)}kg
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map(ability => (
                    <span
                      key={ability.ability.name}
                      className={`px-2 py-1 rounded text-xs ${
                        ability.is_hidden
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {ability.ability.name.replace('-', ' ')}
                      {ability.is_hidden && ' (Hidden)'}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>Base Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pokemon.stats.map(stat => {
                  const maxStat = 255; // Theoretical max for most stats
                  const percentage = (stat.base_stat / maxStat) * 100;

                  return (
                    <div key={stat.stat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 capitalize">
                          {getStatIcon(stat.stat.name)}
                          {stat.stat.name.replace('-', ' ')}
                        </div>
                        <span className="font-medium">{stat.base_stat}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>TanStack Query Features Demonstrated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Data Fetching</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Automatic caching and deduplication</li>
                <li>• Loading and error states</li>
                <li>• Background refetching</li>
                <li>• Query invalidation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">User Experience</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Optimistic updates</li>
                <li>• Stale-while-revalidate</li>
                <li>• Offline support</li>
                <li>• DevTools integration</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Cache Status:</strong> Pokemon data is cached
              automatically. Try searching for the same Pokemon multiple times
              to see instant loading!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute('/api-demo')({
  component: PokemonPage,
});
