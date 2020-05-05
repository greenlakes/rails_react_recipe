Rails.application.routes.draw do

	root 'homepage#index'

  namespace :api do
    namespace :v1 do
      get 'recipes/index'
      post 'recipes/create'
      get '/show/:id', to: 'recipes#show'
      delete '/destroy/:id', to: 'recipes#destroy'
    end
  end

	# Below we also added a catch all route with get '/*path' that will direct any other request that doesn’t match the existing routes to
	# the index action of the homepage controller. This way, the routing on the frontend will handle requests that are not related to
	# creating, reading, or deleting recipes.

	get '/*path' => 'homepage#index'
end


